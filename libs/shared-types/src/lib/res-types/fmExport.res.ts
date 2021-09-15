/* eslint-disable camelcase */

import { FmOrder, FmOrderExportItemOption } from './fmOrder.res';

export interface FmExport {
  /** 출고고유번호 */
  export_seq: number;
  /** 출고코드번호 */
  export_code: string;
  /** 출고상태 */
  status: '45' | '55' | '65' | '75';
  /** 구매확정 */
  buy_confirm: 'admin' | 'user' | 'system' | 'none';
  /** 구매확정일자 */
  confirm_date: Date | null;
  /** 주문번호 */
  order_seq: string | number;
  /** '적립금 지급여부'; */
  reserve_save: 'none' | 'save';
  /** 해외배송여부(domestic:국내배송,international:해외배송) */
  international: 'domestic' | 'international';
  /** 국내배송수단 */
  domestic_shipping_method: string | null;
  /** 택배사 */
  delivery_company_code: string | null;
  /** 송장번호 */
  delivery_number: string | null;
  /** 해외송장번호 */
  international_shipping_method: string | null;
  /** 해외송장번호 */
  international_delivery_no: string | null;
  /** 상태변경일시 */
  status_date: Date | null;
  /** 출고일시 */
  export_date: Date;
  /** 출고완료일자 */
  complete_date: Date | null;
  /** 등록일시 */
  regist_date: Date;
  /** 중요체크 */
  important: '0' | '1';
  /** 배송완료일시 */
  shipping_date: Date;
  /** 정산그룹 */
  account_gb: 'none' | 'hold' | 'carried' | 'complete';
  /** 정산일자 */
  account_date: Date | null;
  /** 월2회 정산회차 */
  account_2round: string | null;
  /** 월4회 정산회차 */
  account_4round: string | null;
  /** 배송그룹사 번호 */
  shipping_provider_seq: number | null;
  /** 택배연동여부 */
  invoice_send_yn: 'n' | 'y';
  /** 정산일련번호 */
  account_seq: number | null;
  /** 쇼셜쿠폰상품 환불완료날짜 */
  socialcp_refund_day: string;
  /** 확정자 */
  socialcp_confirm: 'admin' | 'system' | 'none';
  /** 쇼셜쿠폰상품 확정 */
  socialcp_status: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  /** 쇼셜쿠폰상품 상태확정일자 */
  socialcp_confirm_date: Date | null;
  /** 굿스플로 연동 로그 고유값 */
  gf_seq: number | string | null;
  /** 묶음주문 출고코드번호 */
  bundle_export_code: string;
  /** 출고창고 고유번호 */
  wh_seq: number;
  /** Npay 출고일시 */
  npay_export_date: Date | null;
  /** Npay 배송완료일시 */
  npay_shipping_date: Date | null;
  /** Npay 보류해제선택 */
  npay_flag_release: string | null;
  /** Npay 주문번호 */
  npay_order_id: string | null;
  /** 출고당시 배송그룹 */
  shipping_group: string | null;
  /** 출고당시 배송방법 */
  shipping_method: string | null;
  /** 출고당시 배송방법 명 */
  shipping_set_name: string | null;
  /** 출고당시 수령매장 창고연결여부 */
  store_scm_type: string | null;
  /** 출고당시 수령매장 정보 */
  shipping_address_seq: string | number | null;
  /** 오픈마켓송장전송실패 */
  market_fail: string | null;
  /** 톡구매 발송처리일시 */
  talkbuy_export_date: string | null;
  /** 톡구매 구매확정 일시 */
  talkbuy_shiping_date: string | null;
  /** 톡구매 주문번호 */
  talkbuy_order_id: string | null;
  /** 주문자명 */
  order_user_name: string;
  /** 주문자전화 */
  order_phone: string | null;
  /** 주문자휴대폰 */
  order_cellphone: string;
  /** 주문자이메일 */
  order_email: string;
  /** 받는자 명 */
  recipient_user_name: FmOrder['recipient_user_name'];
  /** 받는자 전화번호 */
  recipient_phone: FmOrder['recipient_phone'];
  /** 받는자 휴대전화 */
  recipient_cellphone: FmOrder['recipient_cellphone'];
  /** 받는자 주소지 우편번호 */
  recipient_zipcode: FmOrder['recipient_zipcode'];
  /** 받는자 주소지 */
  recipient_address: FmOrder['recipient_address'];
  /** 받는자 주소지(도로명) */
  recipient_address_street: FmOrder['recipient_address_street'];
  /** 받는자 주소지 상세 */
  recipient_address_detail: FmOrder['recipient_address_detail'];
  /** 받는자 이메일 */
  recipient_email: FmOrder['recipient_email'];
}

export type FmExportItem = FmOrderExportItemOption;
export type FmExportRes = FmExport & {
  /** 이 출고에 포함된 상품(옵션) 목록 */
  items: FmExportItem[];
};
