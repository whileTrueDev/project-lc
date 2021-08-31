import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsListDto,
  GoodsOptionWithStockInfo,
  GoodsOptionsWithSupplies,
  TotalStockInfo,
  GoodsListRes,
} from '@project-lc/shared-types';

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
  }: GoodsListDto & { email?: string }): Promise<GoodsListRes> {
    const items = await this.prisma.goods.findMany({
      skip: (page - 1) * itemPerPage,
      take: itemPerPage,
      where: { seller: { email } },
      orderBy: [{ [sort]: direction }],
      include: {
        options: {
          include: {
            supply: true,
          },
        },
        confirmation: true,
      },
    });

    const list = items.map((item) => {
      const optionsWithStockInfo = this.addAvailableStockInfoToOptions(item.options);
      const itemStockInfo = this.intergrateOptionStocks(optionsWithStockInfo);
      return {
        id: item.id,
        sellerId: item.sellerId,
        goods_name: item.goods_name,
        runout_policy: item.runout_policy,
        shipping_policy: item.shipping_policy,
        regist_date: item.regist_date,
        update_date: item.update_date,
        goods_status: item.goods_status,
        goods_view: item.goods_view,
        ...itemStockInfo,
        confirmation: item.confirmation ? item.confirmation.status : null,
      };
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
      items: list,
      totalItemCount,
      maxPage,
      currentPage,
      nextPage,
      prevPage,
    };
  }

  // 상품옵션목록에 각 옵션 별 가용재고 정보를 추가
  private addAvailableStockInfoToOptions(
    options: GoodsOptionsWithSupplies[],
  ): GoodsOptionWithStockInfo[] {
    return options.map((option) => {
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
  }

  // 옵션별 재고 통합
  private intergrateOptionStocks(
    optionsWithStockInfo: GoodsOptionWithStockInfo[],
  ): TotalStockInfo {
    return optionsWithStockInfo.reduce(
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
  }

  // 옵션 재고 조회
  public async getStockInfo(goods_seq: number) {
    const optionStocks = await this.prisma.goodsOptions.findMany({
      where: { goods: { id: goods_seq } },
      include: { supply: true },
    });

    // 해당 상품의 옵션별 이름, 가격, 재고정보 추가
    const optionsInfo = this.addAvailableStockInfoToOptions(optionStocks);

    // 해당 상품의 전체 재고 정보------------------------------
    const stockInfo = this.intergrateOptionStocks(optionsInfo);

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
