import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CouponDto } from '@project-lc/shared-types';
import { GoodsService } from '@project-lc/nest-modules-goods';

@Injectable()
export class CouponService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly goodsService: GoodsService,
  ) {}

  /** 특정 쿠폰 상세조회 */
  public async findCoupon(couponId: number): Promise<Coupon> {
    return this.prismaService.coupon.findFirst({
      where: {
        id: couponId,
      },
      include: {
        customerCoupons: {
          include: {
            customer: {
              select: {
                email: true,
                nickname: true,
              },
            },
            logs: true,
          },
        },
      },
    });
  }

  /** 쿠폰 전체 목록 조회 */
  public async findCoupons(): Promise<Coupon[]> {
    return this.prismaService.coupon.findMany({
      include: {
        goods: true,
      },
    });
  }

  /** 쿠폰 생성 */
  public async createCoupon(dto: CouponDto): Promise<Coupon> {
    let goodsList = [];

    if (dto.applyType === 'selectedGoods') {
      goodsList = dto.goods.map((item) => ({ id: item }));
    } else if (dto.applyType === 'exceptSelectedGoods') {
      goodsList = await this.goodsService
        .findAllConfirmedLcGoodsListWithCategory()
        .then((item) =>
          item
            .map((value) => !dto.goods.includes(value.id) && { id: value.id })
            .filter(Boolean),
        );
    }
    return this.prismaService.coupon.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        goods: {
          connect: goodsList,
        },
      },
    });
  }

  /** 특정 쿠폰 수정 */
  public async updateCoupon(id: number, dto: CouponDto): Promise<Coupon> {
    return this.prismaService.coupon.update({
      where: { id },
      data: { ...dto },
    });
  }

  /** 특정 쿠폰 제거 */
  public async deleteCoupon(couponId: number): Promise<Coupon> {
    return this.prismaService.coupon.delete({
      where: { id: couponId },
    });
  }
}
