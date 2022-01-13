import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterSettlementTargetRes,
  FmExport,
  FmSettlementTarget,
  FmSettlementTargetBase,
  FmSettlementTargetOptions,
} from '@project-lc/shared-types';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmExportsService } from '../fm-exports/fm-exports.service';

@Injectable()
export class FmSettlementService {
  constructor(
    private readonly db: FirstmallDbService,
    private readonly prisma: PrismaService,
    private readonly exportsService: FmExportsService,
  ) {}

  // * 판매자 정산 대상 목록 조회
  public async findAllSettleTargetList(): Promise<Array<FmSettlementTarget>> {
    const settled = await this.prisma.sellerSettlements.findMany();

    // 정산이 완료되지 않은 출고내역 조회
    const sql = `SELECT
      fm_order.*,
      export_seq, export_code, status, buy_confirm, confirm_date, fm_goods_export.order_seq,
      complete_date, account_date, shipping_date, fm_goods_export.regist_date AS export_date, fm_order.regist_date AS order_date,
      shipping_cost
    FROM fm_goods_export
      JOIN fm_order USING (order_seq)
    WHERE account_date IS NULL AND buy_confirm != "none"`;
    const result: FmSettlementTargetBase[] = await this.db.query(
      settled.length > 0
        ? `${sql}  AND export_seq NOT IN (${settled.map((x) => x.exportId).join(',')})`
        : sql,
    );
    if (result.length === 0) return [];

    const realResult: FmSettlementTargetBase[] = result.map((target) => {
      const alreadySettledExport = settled.find((s) => s.orderId === target.order_seq);
      if (alreadySettledExport && alreadySettledExport.shippingCostIncluded) {
        return { ...target, shipping_cost: '0', shippingCostAlreadyCalculated: true };
      }
      return { ...target, shippingCostAlreadyCalculated: false };
    });

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
        WHERE account_date IS NULL AND buy_confirm != "none"
      )`;
    const exportOptions: FmSettlementTargetOptions[] = await this.db.query(sql2);

    // 각 출고아이템의 상품번호를 통해 project-lc seller 정보 조회 (goodsConfirmation)
    const goods_seq_arr = exportOptions.map((o) => o.goods_seq);

    const lcGoodsList = await this.prisma.liveShopping.findMany({
      where: {
        fmGoodsSeq: {
          in: goods_seq_arr,
        },
      },
      select: {
        fmGoodsSeq: true,
        goods: {
          include: {
            LiveShopping: true,
            seller: {
              include: {
                sellerShop: {
                  select: {
                    shopName: true,
                  },
                },
                sellerSettlementAccount: {
                  select: {
                    id: true,
                    bank: true,
                    name: true,
                    number: true,
                    settlementAccountImageName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const exports = realResult.map((r) => ({
      ...r,
      options: exportOptions
        .filter((o) => o.export_code === r.export_code)
        .map((o) => {
          const lcgoods = lcGoodsList.find((g) => g.fmGoodsSeq === o.goods_seq);
          if (lcgoods) {
            return {
              ...o,
              seller: lcgoods.goods.seller,
              LiveShopping: lcgoods.goods.LiveShopping,
            };
          }
          return { ...o, seller: null, LiveShopping: [] };
        }),
    }));

    return exports;
  }

  /** 모든 방송인 정산 대상 목록 조회
   * @param broadcasterId optional. 방송인 고유 아이디. 명시한 경우 해당 방송인의 정산 대상 목록을 조회
   */
  public async findBcSettleTargetList(
    broadcasterId?: number,
  ): Promise<BroadcasterSettlementTargetRes> {
    // 방송인 정산 대상 목록이란
    // "방송인이 명시된 주문에 대한 출고 중, 아직 정산되지 않은 '구매확정'된 상태의 모든 출고"

    // * 앞서 이미 방송인 정산된 출고내역 조회
    const alreadySettled = await this.prisma.broadcasterSettlementItems.findMany({
      select: { exportCode: true },
      where: broadcasterId ? { liveShopping: { broadcasterId } } : undefined,
    });
    const alreadySettledExportCodes = alreadySettled.map((s) => s.exportCode);

    // * 라이브쇼핑 정보와 그것에 연결된 fm_goods 정보 조회
    const liveShoppings = await this.prisma.liveShopping.findMany({
      where: broadcasterId
        ? { progress: 'confirmed', broadcasterId }
        : { progress: 'confirmed', NOT: { broadcasterId: null } },
      include: {
        broadcaster: {
          select: {
            email: true,
            id: true,
            userName: true,
            userNickname: true,
            avatar: true,
            agreementFlag: true,
          },
        },
      },
    });
    const liveShoppingFmGoodsSeqs = liveShoppings.map((x) => x.fmGoodsSeq);

    // * 정산 완료되지 않은, 구매완료상태의 출고 내역 조회
    const sql = `
    SELECT fm_goods_export.*, order_user_name, recipient_user_name
    FROM fm_goods_export
    JOIN fm_order USING(order_seq)
    WHERE export_code ${
      alreadySettledExportCodes.length > 0 ? 'NOT IN (?)' : 'IS NOT NULL'
    }
    AND buy_confirm != "none" AND confirm_date IS NOT NULL
    `;
    const _exports: Array<
      FmExport & { order_user_name: string; recipient_user_name: string }
    > = await this.db.query(sql, [alreadySettledExportCodes]);

    // 출고 상세 주문상품 내역 조회
    const items = await this.exportsService.findExportItemsMany(
      _exports.map((e) => e.export_code),
    );

    const result: BroadcasterSettlementTargetRes = _exports
      .map((exp) => {
        // * 라이브쇼핑에 연결된 상품에 대한 주문인 지 확인
        const expItems = items.filter((i) => {
          return (
            i.export_code === exp.export_code &&
            liveShoppingFmGoodsSeqs.includes(Number(i.goods_seq))
          );
        });

        // * 라이브쇼핑 정보 첨부
        const realExpItems = expItems
          .map((i) => {
            const ls = liveShoppings.find((l) => l.fmGoodsSeq === Number(i.goods_seq));
            return { ...i, liveShopping: ls };
          })
          .filter((i) => !!i.liveShopping);

        if (realExpItems.length === 0) return null;
        return { ...exp, items: realExpItems };
      })
      .filter((x) => !!x);

    return result;
  }
}
