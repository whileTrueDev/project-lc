import { Injectable } from '@nestjs/common';
import { CouponLogType, Customer, CustomerCoupon } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CouponStatusDto,
  CreateCustomerCouponDto,
  CreateCustomerCouponManyDto,
  CustomerCouponDto,
  CustomerCouponRes,
  IssueManyCustomerList,
} from '@project-lc/shared-types';

@Injectable()
export class CustomerCouponService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 특정 소비자에게 발급된 쿠폰 모두 조회 */
  findCustomerCoupons(dto: {
    customerId?: CustomerCoupon['customerId'];
    couponId?: CustomerCoupon['couponId'];
  }): Promise<CustomerCouponRes[]> {
    return this.prismaService.customerCoupon.findMany({
      where: {
        customerId: Number(dto.customerId) || undefined,
        couponId: Number(dto.couponId) || undefined,
      },
      include: {
        customer: {
          select: {
            nickname: true,
            email: true,
          },
        },
        coupon: {
          include: {
            goods: {
              select: {
                id: true,
                goods_name: true,
                image: { take: 1, orderBy: { cut_number: 'asc' } },
              },
            },
          },
        },
      },
    });
  }

  /** 발급된 특정 쿠폰 조회 */
  findCustomerCoupon(customerCouponId: CustomerCouponDto['id']): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.findFirst({
      where: { id: customerCouponId || undefined },
    });
  }

  /** 특정 소비자에게 쿠폰 발급 */
  createCustomerCoupon(dto: CreateCustomerCouponDto): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.create({
      data: { logs: { create: { type: 'issue' } }, ...dto },
    });
  }

  /** 특정 소비자에게 (회원가입)웰컴쿠폰 발급 */
  async createCustomerWelcomeCoupon(customerId: number): Promise<CustomerCoupon | null> {
    const welcomeCoupon = await this.prismaService.coupon.findFirst({
      where: { name: '회원가입 3,000원 할인 쿠폰' },
    });
    if (!welcomeCoupon) return null;
    return this.createCustomerCoupon({
      couponId: welcomeCoupon.id,
      customerId,
      status: 'notUsed',
    });
  }

  async createAllCustomerCoupon(
    dto: CreateCustomerCouponManyDto,
    customers?: Customer[],
  ): Promise<number> {
    let target: IssueManyCustomerList[];
    if (customers) {
      target = customers.map((item) => {
        return { customerId: item.id, couponId: dto.couponId, status: dto.status };
      });
    } else if (dto.customerIds.length) {
      target = dto.customerIds.map((id) => {
        return { customerId: id, couponId: dto.couponId, status: dto.status };
      });
    }

    const result = await this.prismaService.$transaction(
      target.map((item: IssueManyCustomerList) => {
        return this.prismaService.customerCoupon.create({
          data: { ...item, logs: { create: [{ type: 'issue' }] } },
        });
      }),
    );
    return result.length;
  }

  /** 특정 소비자에게 발급된 쿠폰 상태 변경 */
  async updateCustomerCouponStatus(dto: CouponStatusDto): Promise<CustomerCoupon> {
    let couponLogType: CouponLogType;
    if (dto.status === 'used') {
      couponLogType = CouponLogType.use;
    } else if (dto.status === 'notUsed') {
      couponLogType = CouponLogType.restore;
    }
    const writeCustomerCoupon = this.prismaService.customerCoupon.update({
      where: { id: dto.id },
      data: { status: dto.status },
    });

    const writeLog = this.prismaService.customerCouponLog.create({
      data: { customerCouponId: dto.id, type: couponLogType, orderId: dto.orderId },
    });

    const [customerCouon] = await this.prismaService.$transaction([
      writeCustomerCoupon,
      writeLog,
    ]);
    return customerCouon;
  }

  /** 특정 소비자에게 발급된 쿠폰 제거 */
  deleteCustomerCoupon(
    customerCouponId: CustomerCouponDto['id'],
  ): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.delete({
      where: { id: customerCouponId },
    });
  }
}
