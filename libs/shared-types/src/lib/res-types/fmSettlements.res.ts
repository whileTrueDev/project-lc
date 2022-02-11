import {
  LiveShopping,
  ProductPromotion,
  Seller,
  SellerSettlementAccount,
} from '.prisma/client';
import { FmExport } from './fmExport.res';
import { FmGoodsOption } from './fmGoods.res';
import { FmOrder, FmOrderItem, FmOrderOption } from './fmOrder.res';

export interface FmExportItemFullInfo {
  /** 고유번호 */
  export_item_seq: number;
  /** 출고코드번호 */
  export_code: FmExport['export_code'];
  /** 주문상품번호 */
  item_seq: number;
  /** 주문옵션번호 */
  option_seq: number | null;
  /** 주문서브옵션번호 */
  suboption_seq: number | null;
  /** 수량 */
  ea: number;
  /** 티켓 상품 티켓인증코드 */
  coupon_serial: string | null;
  /** 전체 ea에서의 출고회차 */
  coupon_st: number | null;
  /** 쿠폰발송 이메일 주소 */
  recipient_email: string | null;
  /** 쿠폰발송 SMS 번호 */
  recipient_cellphone: string | null;
  /** 이메일 발송 결과 ( y:성공,n:실패 ) */
  mail_status: 'y' | 'n';
  /** SMS 발송 결과 ( y:성공,n:실패 ) */
  sms_status: 'y' | 'n';
  /** 쿠폰 값어치 종류:금액(price), 횟수(pass) */
  coupon_value_type: 'price' | 'pass';
  /** 쿠폰 값어치 ( 횟수 or 금액 ) */
  coupon_value: string | null;
  /** 쿠폰 남은 값어치 ( 횟수 or 금액 ) */
  coupon_remain_value: string | null;
  /** 지급예정수량 */
  reserve_ea: number;
  /** 적립금 지급수량 */
  reserve_buyconfirm_ea: number;
  /** 반품수량(지급예정) */
  reserve_return_ea: number;
  /** 지급예정소멸수량 */
  reserve_destroy_ea: number;
  /** 묶음주문 출고코드번호 */
  bundle_export_code: string;
  /** 출고당시 창고 평균매입가 */
  scm_supply_price: string | null;
  /** Npay 상품주문번호 */
  npay_product_order_id: string | null;
  /** npay 전송결과 */
  npay_status: 'y' | 'n';
  /** 톡구매 상품주문번호 */
  talkbuy_product_order_id: string | null;
  /** 톡구매 전송결과 */
  talkbuy_status: string | null;
}

export type FmSettlementTargetOptions = {
  /** 상품 고유 번호 */
  goods_seq: FmGoodsOption['goods_seq'];
} & FmExportItemFullInfo &
  FmOrderItem &
  FmOrderOption;

export type FmSettlementTargetBase = {
  export_seq: FmExport['export_seq'];
  export_code: FmExport['export_code'];
  status: FmExport['status'];
  buy_confirm: FmExport['buy_confirm'];
  confirm_date: FmExport['confirm_date'];
  order_seq: FmExport['order_seq'];
  complete_date: FmExport['complete_date'];
  account_date: FmExport['account_date'];
  shipping_date: FmExport['shipping_date'];
  export_date: FmExport['regist_date'];
  order_date: FmOrder['regist_date'];
  shipping_cost: FmOrder['shipping_cost'];
  shippingCostAlreadyCalculated?: boolean;
} & FmOrder;

export type FmSettlementTarget = FmSettlementTargetBase & {
  options: Array<
    FmSettlementTargetOptions & {
      seller:
        | (Seller & {
            sellerShop: {
              shopName: string;
            } | null;
            sellerSettlementAccount: {
              number: SellerSettlementAccount['number'];
              bank: SellerSettlementAccount['bank'];
              name: SellerSettlementAccount['name'];
              id: SellerSettlementAccount['id'];
              settlementAccountImageName: SellerSettlementAccount['settlementAccountImageName'];
            }[];
          })
        | null;
      LiveShopping: LiveShopping[];
      productPromotion: ProductPromotion[];
    }
  >;
};
