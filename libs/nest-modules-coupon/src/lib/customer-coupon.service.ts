import { Injectable } from '@nestjs/common';
import { CustomerCoupon, CouponLogType } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerCouponDto, CouponStatusDto } from '@project-lc/shared-types';

@Injectable()
export class CustomerCouponService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 특정 소비자에게 발급된 쿠폰 모두 조회 */
  findCustomerCoupons(
    customerId?: CustomerCouponDto['customerId'],
  ): Promise<CustomerCoupon[]> {
    return this.prismaService.customerCoupon.findMany({
      where: { customerId: customerId || undefined },
    });
  }

  /** 발급된 특정 쿠폰 조회 */
  findCustomerCoupon(customerCouponId: CustomerCouponDto['id']): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.findFirst({
      where: { id: customerCouponId || undefined },
    });
  }

  /** 특정 소비자에게 쿠폰 발급 */
  createCustomerCoupon(dto: CustomerCouponDto): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.create({
      data: { logs: { create: { type: 'issue' } }, ...dto },
    });
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
      data: { customerCouponId: dto.id, type: couponLogType },
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
