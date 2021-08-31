import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsListDto } from '@project-lc/shared-types';

@Injectable()
export class GoodsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자의 승인된 상품 ID 목록을 가져옵니다.
   * @param email seller.sub 로그인된 판매자 정보
   * @param ids? 특정 상품의 firstMallGoodsId만 조회하고 싶을 때
   */
  public async findMyGoodsIds(email: Seller['email'], ids?: number[]): Promise<number[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
        seller: { email },
        id: ids ? { in: ids } : undefined,
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
   * 모든 상품 목록 조회
   * email 이 주어지면 해당 판매자의 상품만 조회
   * dto : email, page, itemPerPage, sort, direction
   * return : maxPage, totalItemCount, currentPage, prevPage, nextPage, items
   */
  public async getGoodsList({
    email,
    page,
    itemPerPage,
    sort,
    direction,
  }: GoodsListDto & { email?: string }) {
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

  // 옵션 재고 조회
  public async getStockInfo(goods_seq: number) {
    const optionStocks = await this.prisma.goodsOptions.findMany({
      where: { goods: { id: goods_seq } },
      include: { supply: true },
    });

    // 해당 상품의 옵션별 이름, 가격, 재고정보---------------------
    const optionsInfo = optionStocks.map((option) => {
      const {
        id,
        default_option,
        option_title,
        consumer_price,
        price,
        option_view,
        supply,
      } = option;

      const stock = supply.reduce((sum, sup) => sum + sup.stock, 0); // 옵션의 재고
      const badstock = supply.reduce((sum, sup) => sum + sup.badstock, 0); // 옵션의 불량재고
      const rstock = stock - badstock; // 옵션의 가용재고
      return {
        id,
        default_option,
        option_title,
        consumer_price,
        price,
        option_view,
        stock,
        badstock,
        rstock, // 가용재고
      };
    });

    // 해당 상품의 전체 재고 정보------------------------------
    const stockInfo = optionsInfo.reduce(
      (total, option) => {
        return {
          rstock: total.rstock + option.rstock,
          a_stock_count:
            option.rstock > 0 ? total.a_stock_count + 1 : total.a_stock_count,
          b_stock_count:
            option.rstock <= 0 ? total.b_stock_count + 1 : total.b_stock_count,
          a_rstock: option.rstock > 0 ? total.a_rstock + option.rstock : total.a_rstock,
          b_rstock: option.rstock <= 0 ? total.b_rstock + option.rstock : total.b_rstock,
          a_stock: option.rstock > 0 ? total.a_stock + option.stock : total.a_stock,
          b_stock: option.rstock <= 0 ? total.b_stock + option.stock : total.b_stock,
        };
      },
      {
        rstock: 0, // 해당 상품의 전체 가용 재고
        a_stock_count: 0, // 가용재고 1개 이상인 옵션 개수
        b_stock_count: 0, // 가용재고 0개 이하인 옵션 개수
        a_rstock: 0, // 가용재고 1개 이상인 옵션의 가용재고
        b_rstock: 0, // 가용재고 0개 이하인 옵션의 가용재고
        a_stock: 0, // 가용재고 1개 이상인 옵션의 재고
        b_stock: 0, // 가용재고 0개 이하인 옵션의 재고
      },
    );

    return {
      options: optionsInfo,
      ...stockInfo,
    };
  }

  // 유저가 등록한 상품 삭제
  // dto: email, [itemId, itemId, ...]
  public async deleteLcGoods({ email, ids }: { email: string; ids: number[] }) {
    try {
      return this.prisma.goods.deleteMany({
        where: {
          seller: { email },
          id: {
            in: ids,
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  // 노출여부 변경
  public async changeGoodsView(id: number, view: 'look' | 'notLook') {
    try {
      return this.prisma.goods.update({
        where: { id },
        data: {
          goods_view: view,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
