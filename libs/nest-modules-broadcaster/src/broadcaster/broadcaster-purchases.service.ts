import { BadRequestException, Injectable } from '@nestjs/common';
import { Broadcaster, LiveShopping } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterPurchasesRes } from '@project-lc/shared-types';

@Injectable()
export class BroadcasterPurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  /** 판매 유형에 상관없이 구매 목록 조회 */
  public async findAll(
    broadcasterId: Broadcaster['id'],
  ): Promise<BroadcasterPurchasesRes> {
    return this.prisma.orderItem.findMany({
      include: {
        order: {
          select: {
            orderCode: true,
            id: true,
            step: true,
            paymentPrice: true,
            supportOrderIncludeFlag: true,
          },
        },
        support: true,
        options: true,
        goods: { select: { goods_name: true } },
        // TODO orderItems. productPromotion, liveShopping 구성 이후 추가
      },
      where: { support: { broadcasterId } },
    });
  }

  /** 라이브쇼핑 기준 구매 목록 조회 */
  public async findByLiveShopping(
    broadcasterId: Broadcaster['id'],
    liveShoppingId?: LiveShopping['id'],
  ): Promise<any> {
    if (!liveShoppingId)
      throw new BadRequestException(
        'by를 liveShopping 으로 설정한 경우 liveShoppingId 쿼리파라미터가 필수로 필요합니다.',
      );
  }

  /** 상품홍보 기준 구매 목록 조회 */
  public async findByProductPromotion(
    broadcasterId: Broadcaster['id'],
    productPromotionId?: LiveShopping['id'],
  ): Promise<any> {
    if (!productPromotionId)
      throw new BadRequestException(
        'by를 productPromotion 으로 설정한 경우 productPromotionId 쿼리파라미터가 필수로 필요합니다.',
      );
  }
}
