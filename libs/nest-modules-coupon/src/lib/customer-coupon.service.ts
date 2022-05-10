import { Injectable } from '@nestjs/common';
import { CustomerCoupon, CouponLogType, Customer } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CouponDto, CustomerCouponDto } from '@project-lc/shared-types';

@Injectable()
export class CustomerCouponService {
  constructor(private readonly prismaService: PrismaService) {}

  findCustomerCoupons(dto?: { customerId: number }): Promise<CustomerCoupon[]> {
    return this.prismaService.customerCoupon.findMany({
      where: {
        customerId: dto.customerId || undefined,
      },
    });
  }

  findCustomerCoupon(dto): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.findFirst({
      where: {
        id: dto.customerCouponId || undefined,
      },
    });
  }

  createCustomerCoupon(dto): Promise<CustomerCoupon> {
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

  async updateCustomerCouponStatus(dto): Promise<CustomerCoupon> {
    let couponLogType: CouponLogType;
    if (dto.status === 'used') {
      couponLogType = CouponLogType.use;
    } else if (dto.status === 'notUsed') {
      couponLogType = CouponLogType.restore;
    }
    const writeCustomerCoupon = this.prismaService.customerCoupon.update({
      where: {
        id: dto.customerCouponId,
      },
      data: {
        status: dto.status,
      },
    });

    const writeLog = this.prismaService.customerCouponLog.create({
      data: {
        customerCouponId: dto.customerCouponId,
        type: couponLogType,
      },
    });

    const [customerCouon] = await this.prismaService.$transaction([
      writeCustomerCoupon,
      writeLog,
    ]);
    return customerCouon;
  }

  // 로그 서비스 따로 만들어서 트랜잭션으로 연결하기

  deleteCustomerCoupon(dto): Promise<CustomerCoupon> {
    return this.prismaService.customerCoupon.delete({
      where: {
        id: dto.customerCouponId,
      },
    });
  }
}
