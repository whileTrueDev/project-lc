import { Injectable } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsListDto } from '@project-lc/shared-types';

@Injectable()
export class GoodsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자의 승인된 상품 ID 목록을 가져옵니다.
   * @param seller 로그인된 판매자 정보
   */
  public async findMyGoodsIds(email: Seller['email']): Promise<number[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
        seller: { email },
        AND: {
          confirmation: {
            status: 'confirmed',
          },
        },
      },
      select: {
        confirmation: {
          select: {
            firstmallGoodsConnectionId: true,
          },
        },
      },
    });

    return goodsIds.map(
      (confirmation) => confirmation.confirmation.firstmallGoodsConnectionId,
    );
  }

  /**
   * 판매자가 등록한 모든 상품 목록 조회
   * dto : email, page, itemPerPage, sort, direction
   * return : maxPage, totalItemCount, currentPage, prevPage, nextPage, items
   */
  public async getGoodsList({
    email,
    page,
    itemPerPage,
    sort,
    direction,
  }: GoodsListDto & { email: string }) {
    const items = await this.prisma.goods.findMany({
      skip: (page - 1) * itemPerPage,
      take: itemPerPage,
      where: { seller: { email } },
      orderBy: [{ [sort]: direction }],
      select: {
        id: true,
        sellerId: true,
        goods_name: true,
        runout_policy: true,
        shipping_policy: true,
        regist_date: true,
        update_date: true,
        goods_status: true,
        goods_view: true,
        options: {
          select: {
            default_option: true,
            consumer_price: true,
            price: true,
            supply: {
              select: {
                stock: true,
                badstock: true,
                safe_stock: true,
              },
            },
          },
        },
        confirmation: {
          select: { id: true, status: true, firstmallGoodsConnectionId: true },
        },
      },
    });

    // 해당 판매자가 등록한 전체 아이템 개수
    const totalItemCount = await this.prisma.goods.count({
      where: { seller: { email } },
    });
    const maxPage = Math.ceil(totalItemCount / itemPerPage); // 마지막페이지
    const currentPage = page; // 현재페이지
    const nextPage = currentPage < maxPage ? currentPage + 1 : null; // 다음페이지
    const prevPage = currentPage > 1 ? currentPage - 1 : null; // 이전페이지

    return {
      items,
      totalItemCount,
      maxPage,
      currentPage,
      nextPage,
      prevPage,
    };
  }

  public async deleteGoods() {
    const deleteGoods = await this.prisma.goods.delete;
  }
}
