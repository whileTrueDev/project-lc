import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FmSettlementTargetBase,
  FmSettlementTargetOptions,
  FmSettlementTargets,
} from '@project-lc/shared-types';
import {
  SellerSettlementItemOptions,
  SellerSettlementItems,
  SellerSettlements,
} from '.prisma/client';
import { FirstmallDbService } from '../firstmall-db.service';

@Injectable()
export class FmSettlementService {
  constructor(
    private readonly db: FirstmallDbService,
    private readonly prisma: PrismaService,
  ) {}

  public async findAllSettleTargetList(): Promise<Array<FmSettlementTargets>> {
    // 정산이 완료되지 않은 출고내역 조회
    const sql = `SELECT
      export_code, status, confirm_date, order_seq,
      complete_date, account_date, shipping_date, regist_date
    FROM fm_goods_export
    WHERE account_date IS NULL`;
    const result: FmSettlementTargetBase[] = await this.db.query(sql);

    if (result.length === 0) return [];

    // 각 출고내역별 출고 아이템 조회
    const sql2 = `
    SELECT foi.goods_seq, fgei.*, foio.*, foi.*
    FROM fm_goods_export_item AS fgei
    JOIN fm_order_item_option AS foio ON fgei.option_seq = foio.item_option_seq
    JOIN fm_order_item AS foi ON fgei.item_seq = foi.item_seq
    WHERE export_code
      IN (
        SELECT export_code
        FROM fm_goods_export
        WHERE account_date IS NULL
      )`;
    const exportOptions: FmSettlementTargetOptions[] = await this.db.query(sql2);

    // 각 출고아이템의 상품번호를 통해 project-lc seller 정보 조회 (goodsConfirmation)
    const goods_seq_arr = exportOptions.map((o) => o.goods_seq);
    const lcGoodsList = await this.prisma.goodsConfirmation.findMany({
      where: {
        firstmallGoodsConnectionId: {
          in: goods_seq_arr,
        },
      },
      select: {
        firstmallGoodsConnectionId: true,
        goods: {
          include: {
            seller: {
              include: {
                sellerShop: {
                  select: {
                    shopName: true,
                  },
                },
                sellerSettlementAccount: {
                  select: {
                    bank: true,
                    name: true,
                    number: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const exports = result.map((r) => ({
      ...r,
      options: exportOptions
        .filter((o) => o.export_code === r.export_code)
        .map((o) => {
          const lcgoods = lcGoodsList.find(
            (g) => g.firstmallGoodsConnectionId === o.goods_seq,
          );
          if (lcgoods) {
            return { ...o, seller: lcgoods.goods.seller };
          }
          return { ...o, seller: null };
        }),
    }));

    return exports;
  }

  // ********************************
  // * 유틸함수
  // ********************************
  private __reduceCompletedSettlements(
    alreadyDone: (SellerSettlements & {
      settlementItems: (SellerSettlementItems & {
        options: SellerSettlementItemOptions[];
      })[];
    })[],
  ): Record<
    'orderIds' | 'orderItemIds' | 'orderItemOptionIds' | 'refundCodes',
    Array<string>
  > {
    return alreadyDone.reduce(
      (acc, curr) => {
        const order = acc.orderIds.concat(curr.settlementItems.map((y) => y.orderId));
        const refund = acc.refundCodes.concat(
          curr.settlementItems.map((y) => y.refundCode),
        );

        const orderItemIds: string[] = [];
        const orderItemOptionIds: string[] = [];
        curr.settlementItems.forEach((item) => {
          item.options.forEach((option) => {
            if (option.itemId && option.optionId) {
              orderItemIds.push(option.itemId);
              orderItemOptionIds.push(option.optionId);
            }
          });
        });

        return {
          orderIds: order,
          refundCodes: refund,
          orderItemIds,
          orderItemOptionIds,
        };
      },
      {
        orderIds: [],
        orderItemIds: [],
        orderItemOptionIds: [],
        refundCodes: [],
      },
    );
  }
}
