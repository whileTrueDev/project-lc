import { Injectable } from '@nestjs/common';
import { CustomerCoupon, CouponLogType } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerCouponDto, CouponStatusDto } from '@project-lc/shared-types';

@Injectable()
export class CustomerCouponService {
  constructor(private readonly prismaService: PrismaService) {}

  findCustomerCoupons(
    customerId?: CustomerCouponDto['customerId'],
  ): Promise<CustomerCoupon[]> {
    return this.prismaService.customerCoupon.findMany({
      where: {
        customerId: customerId || undefined,
      },
    });
  }

  findCustomerCoupon(customerCouponId: CustomerCouponDto['id']): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.findFirst({
      where: {
        id: customerCouponId || undefined,
      },
    });
  }

  createCustomerCoupon(dto: CustomerCouponDto): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.create({
      data: {
        logs: {
          create: {
            type: 'issue',
          },
        },
        ...dto,
      },
    });
  }

  async updateCustomerCouponStatus(dto: CouponStatusDto): Promise<CustomerCoupon> {
    let couponLogType: CouponLogType;
    if (dto.status === 'used') {
      couponLogType = CouponLogType.use;
    } else if (dto.status === 'notUsed') {
      couponLogType = CouponLogType.restore;
    }
    const writeCustomerCoupon = this.prismaService.customerCoupon.update({
      where: {
        id: dto.id,
      },
      data: {
        status: dto.status,
      },
    });

    const writeLog = this.prismaService.customerCouponLog.create({
      data: {
        customerCouponId: dto.id,
        type: couponLogType,
      },
    });

    const [customerCouon] = await this.prismaService.$transaction([
      writeCustomerCoupon,
      writeLog,
    ]);
    return customerCouon;
  }

  deleteCustomerCoupon(
    customerCouponId: CustomerCouponDto['id'],
  ): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.delete({
      where: {
        id: customerCouponId,
      },
    });
  }
}
