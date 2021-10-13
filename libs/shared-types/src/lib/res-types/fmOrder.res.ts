import { fmOrderStatuses } from '../constants/fmOrderStatuses';

/**
 * 퍼스트몰 주문 정보
 * @author hwasurr
 */
export interface FmOrder {
  /**
   * '고유번호'
   */
  order_seq: number | string;
  /**
   * '맞교환주문의 원주문번호'
   */
  orign_order_seq: number | null;
  /**
   * '현주문의 최상단'
   */
  top_orign_order_seq: number | null;
  /**
   * '회원 고유번호'
   */
  member_seq: number | null;
  /**
   * '개인결제 고유번호'
   */
  person_seq: number | null;
  /**
   * '에누리미적용금액'
   */
  original_settleprice: string;
  /**
   * '실결제금액'
   */
  settleprice: string;
  /**
   * '결제금액(결제통화기준)'
   */
  payment_price: string | null;
  /**
   * '비과세금액'
   */
  freeprice: string | null;
  /**
   * '부가세율'
   */
  tax_rate: string | null;
  /**
   * '에누리',
   */
  enuri: string;
  /**
   * '주문상태',
   */
  step: keyof typeof fmOrderStatuses;
  /**
   * '로그',
   */
  log: string | null;
  /**
   * '입금상태',
   */
  deposit_yn: 'y' | 'n';
  /**
   * '입금일시',
   */
  deposit_date: string | Date | null;
  /**
   * '입금자명',
   */
  depositor: string | null;

  /**
   * '입금계좌정보',
   */
  bank_account: string | null;
  /**
   * '가상계좌정보',
   */
  virtual_account: string | null;
  /**
   * '가상계좌입금제한일',
   */
  virtual_date: string;
  /**
   * 'PG고유번호',
   */
  pg_transaction_number: string | null;
  /**
   * '신용카드승인번호',
   */
  pg_approval_number: string | null;
  /**
   * '현금영수증번호',
   */
  cash_receipts_no: string;
  /**
   * 'PG결제통화',
   */
  pg_currency: string;
  /**
   * 'PG환율(결제통화기준)',
   */
  pg_currency_exchange_rate: string | null;
  /**
   * 'PG환율(결제당시)',
   */
  pg_currency_exchange: string | null;
  /**
   * '적립금사용여부',
   */
  emoney_use: 'none' | 'use' | 'return' | null;
  /**
   * '적립금사용금액',
   */
  emoney: string | null;
  /**
   * '이머니사용여부',
   */
  cash_use: 'none' | 'use' | 'return' | null;
  /**
   * '이머니사용금액',
   */
  cash: string | null;
  /**
   * '주문자명',
   */
  order_user_name: string;
  /**
   * '주문자전화',
   */
  order_phone: string | null;
  /**
   * '주문자휴대폰',
   */
  order_cellphone: string;
  /**
   * '주문자이메일',
   */
  order_email: string;
  /**
   * '받는자명',
   */
  recipient_user_name: string | null;
  /**
   * '받는자전화',
   */
  recipient_phone: string | null;
  /**
   * '받는자휴대폰',
   */
  recipient_cellphone: string | null;
  /**
   * '배송방법',
   */
  shipping_method: string | null;
  /**
   * '배송비결제금액',
   */
  shipping_cost: string;
  /**
   * '착불배송비',
   */
  postpaid: string | null;
  /**
   * '배송비무료조건 금액',
   */
  delivery_if: string | null;
  /**
   * '기본배송비',
   */
  delivery_cost: string | null;
  /**
   * '배송지우편번호',
   */
  recipient_zipcode: string | null;
  /**
   * '도로명-지번 주소구분',
   */
  recipient_address_type: 'street' | 'zibun';
  /**
   * '배송지주소',
   */
  recipient_address: string | null;
  /**
   * '도로명주소',
   */
  recipient_address_street: string | null;
  /**
   * '배송지주소상세',
   */
  recipient_address_detail: string | null;
  /**
   * '도로명주소 goodsflow 용',
   */
  recipient_address_street_gf: string | null;
  /**
   * '국제배송여부(domestic:국내,international:해외)',
   */
  international: 'domestic' | 'international';

  /**
   * '해외배송방법',
   */
  shipping_method_international: string | null;
  /**
   * '지역',
   */
  region: string | null;
  /**
   * '국가KEY',
   */
  nation_key: string | null;
  /**
   * '주소',
   */
  international_address: string | null;
  /**
   * '도시',
   */
  international_town_city: string | null;
  /**
   * '군',
   */
  international_county: string | null;
  /**
   * '우편번호',
   */
  international_postcode: string | null;
  /**
   * '국가',
   */
  international_country: string | null;
  /**
   * '해외배송비',
   */
  international_cost: string;
  /**
   * '배송메시지',
   */
  memo: string | null;
  /**
   * '개별배송메세지 사용여부',
   */
  each_msg_yn: string | null;
  /**
   * '관리자메모',
   */
  admin_memo: string | null;
  /**
   * '사용쿠폰 일련번호',
   */
  download_seq: number | null;
  /**
   * '쿠폰할인금액',
   */
  coupon_sale: string | number | null;
  /**
   * '매출증빙',
   */
  typereceipt: number | null;
  /**
   * 'PG사 명',
   */
  pg: string | null;
  /**
   * 결제방법 enum('card','bank','account','cellphone','virtual','escrow_virtual','escrow_account','point','paypal','kakaomoney','payco_coupon','pos_pay','pay_later')
   */
  payment:
    | 'card'
    | 'bank'
    | 'account'
    | 'cellphone'
    | 'virtual'
    | 'escrow_virtual'
    | 'escrow_account'
    | 'point'
    | 'paypal'
    | 'kakaomoney'
    | 'payco_coupon'
    | 'pos_pay'
    | 'pay_later'
    | null;

  /**
   * '구매방식(direct:바로구매, cart:장바구니구매, admin:관리자구매)',
   */
  mode: string;
  /**
   * '주문접수일',
   */
  regist_date: string | Date;
  /**
   * '세션아이디',
   */
  session_id: string;
  /**
   * '중요체크',
   */
  important: '0' | '1';
  /**
   * '판매환경',
   */
  sitetype: 'P' | 'M' | 'F' | 'OFFLINE' | 'OFFLINEM' | 'APP_ANDROID' | 'APP_IOS' | 'POS';
  /**
   * '유입매체',
   */
  marketplace: string | null;
  /**
   * '주문삭제여부',
   */
  hidden: 'N' | 'Y' | 'T';
  /**
   * '주문삭제일시',
   */
  hidden_date: Date | null;
  /**
   * '관리자주문시 관리자아이디',
   */
  admin_order: string;
  /**
   * '결제확인SMS발송여부',
   */
  sms_25_YN: 'Y' | 'N';
  /**
   * '받는사람이메일',
   */
  recipient_email: string | null;
  /**
   * '고객리마인드서비스유입구분',
   */
  curation_inflow: string | null;
  /**
   * '고객리마인드서비스유입로그',
   */
  curation_seq: number | null;
  /**
   * 'SKIN환경',
   */
  skintype: 'P' | 'M' | 'F' | 'OFF_P' | 'OFF_M' | 'OFF_F';
  /**
   * '유입경로 full url',
   */
  referer: string | null;
  /**
   * '유입경로 domain',
   */
  referer_domain: string | null;
  /**
   * '주문SMS발송여부',
   */
  sms_15_YN: string | null;
  /**
   * '연동업체코드',
   */
  linkage_id: string | null;
  /**
   * '연동업체 주문번호',
   */
  linkage_order_id: string | null;
  /**
   * '연동마켓 주문번호',
   */
  linkage_mall_order_id: string | null;
  /**
   * '연동몰 코드',
   */
  linkage_mall_code: string | null;
  /**
   * '연동 수집 일시'
   */
  linkage_order_reg_date: null;
  /**
   * 'npay 주문번호'
   */
  npay_order_id: string | null;
  /**
   * 'npay 사용자 id'
   */
  npay_orderer_id: string | null;
  /**
   * 'Npay 결제 일시'
   */
  npay_order_pay_date: string | null;
  /**
   * 'sns로그인'
   */
  sns_rute: string | null;
  /**
   * '총주문수량'
   */
  total_ea: number;
  /**
   * '총상품종류'
   */
  total_type: number;
  /**
   * '개인통관부호'
   */
  clearance_unique_personal_code: string | null;
  /**
   * '수집데이터 체크'
   */
  accumul_mark: string | null;
  /**
   * '아이피'
   */
  ip: string | null;
  /**
   * '묶음배송여부'
   */
  bundle_yn: 'y' | 'n';
  /**
   * '악성고객정보'
   */
  blacklist: number | null;
  /**
   * '구입시 적용 스킨 번호'
   */
  skin_seq: number;
  /**
   * 'Npay 연동 서버정보(TEST/REAL)'
   */
  npay_server_info: string | null;
  /**
   * 'Npay 주문 일시'
   */
  npay_order_date: string | null;
  /**
   * 'Npay포인트사용액(네이버부담)'
   */
  npay_point: number | null;
  /**
   * 'Paypal 결제 Token'
   */
  paypal_token: string | null;
  /**
   * '원화(KRW) 환율'
   */
  krw_exchange_rate: number | null;
  /**
   * '무통장입금확인 키'
   */
  autodeposit_key: number | null;
  /**
   * '무통장입금확인 타입'
   */
  autodeposit_type: string | null;
  /**
   * '결제구분(shop/pg/오픈마켓/kakaopay 외 결제업체)'
   */
  payment_type: string | null;
  /**
   * '주문서쿠폰발급번호'
   */
  ordersheet_seq: number | null;
  /**
   * '주문서쿠폰할인금액'
   */
  ordersheet_sale: string | null;
  /**
   * '주문서쿠폰할인금액(원화기준)'
   */
  ordersheet_sale_krw: number | null;
  /**
   * '톡구매 주문번호'
   */
  talkbuy_order_id: string | null;
  /**
   * '톡구매 주문일시'
   */
  talkbuy_order_date: Date | null;
  /**
   * '톡구매 결제일시'
   */
  talkbuy_paid_date: Date | null;
}

/**
 * 퍼스트몰 주문 상품 정보
 * @author hwasurr
 */
export interface FmOrderItem {
  /**
   * 고유번호
   */
  item_seq: number;
  /**
   * '상품고유번호',
   */
  goods_seq: number;
  /**
   * '상품이미지경로',
   */
  image: string | null;
  /**
   * '상품명',
   */
  goods_name: string;
}

/**
 * 주문 상품 정보 응답 타입
 * @author hwasurr
 */
export type FindFmOrderRes = FmOrder & {
  /** 주문아이디 */
  id: FmOrder['order_seq'];
} & {
  goods_name: FmOrderItem['goods_name'];
  /** 이 주문에 포함된 내 order_item 고유번호. 41, 42, 43 과 같은 형태 */
  item_seq: string;
  /** 이 주문에 포함된 내 모든 상품 및 상품옵션의 총 가격의 합 */
  totalPrice: string | null;
  /** 이 주문에 포함된 내 모든 상품 및 상품옵션의 총 개수 */
  totalEa: number;
  /** 이 주문에 포함된 내 모든 상품 및 상품옵션의 총 종류 수 */
  totalType: number;
};

/**
 * 상품 옵션 정보
 */
export interface FmOrderOption {
  /**
   * 주문 상품(옵션) 고유번호
   */
  item_option_seq: number;
  /**
   * 주문 상품 고유번호
   */
  item_seq: number;
  /**
   * 옵션 제목
   */
  title1: string;
  /**
   * 옵션 값
   */
  option1: string;
  /**
   * 주문 상품(옵션) 개수
   */
  ea: number;
  /**
   * 주문 상품(옵션) 상태
   */
  step: FmOrder['step'];
  /**
   * "35" 상품준비 상태 상품(옵션) 개수
   */
  step35: number;
  /**
   * "45" 출고준비 상태 상품(옵션) 개수
   */
  step45: number;
  /**
   * "55" 출고완료 상태 상품(옵션) 개수
   */
  step55: number;
  /**
   * "65" 배송중 상태 상품(옵션) 개수
   */
  step65: number;
  /**
   * "75" 배송완료 상태 상품(옵션) 개수
   */
  step75: number;
  /**
   * "85" 결제취소 상태 상품(옵션) 개수
   */
  step85: number;
  /**
   * 회원 할인가 (number string)
   */
  member_sale: string;
  /**
   * 모바일 할인가 (number string)
   */
  mobile_sale: string;
  /**
   * 옵션 색상
   */
  color?: string;
  /**
   * 옵션 금액 (상품 단가)
   */
  price: string;
  /**
   * 옵션 금액 (할인 제외)
   */
  ori_price: string;
}

export interface FmOrderExportBase {
  /**
   * 출고 고유번호
   */
  export_code: string;
  /** * 합포장 출고 고유번호 */
  bundle_export_code?: string;
  /**
   * 출고 일시 (date string)
   */
  export_date: string;
  /**
   * 출고 완료 일시 (date string)
   */
  complete_date?: string;
  /**
   * 배송 완료 일시 (date string)
   */
  shipping_date?: string;
  /**
   * 출고 상태 45, 55, 65, 75
   */
  export_status: '45' | '55' | '65' | '75';
  /**
   * 출고 택배사 코드
   * - code0 = CJ GLS
   * - code1 = DHL코리아
   * - code2 = KGB택배
   * - code3 = 경동택배
   * - code4 = 대한통운
   * - code5 = 동부택배(훼밀리)
   * - code6 = 로젠택배
   * - code7 = 우체국택배
   * - code8 = 하나로택배
   * - code9 = 한진택배
   * - code10 = 롯데택배
   * - code11 = 동원택배
   * - code12 = 대신택배
   * - code13 = 세덱스
   * - code14 = 동부익스프레스
   * - code15 = 천일택배
   * - code16 = 사가와택배
   * - code17 = 일양택배
   * - code18 = 이노지스
   * - code19 = 편의점택배
   * - code20 = 건영택배
   * - code21 = 엘로우캡
   */
  delivery_company_code: string;
  /**
   * 송장번호
   */
  delivery_number: string;
  /**
   * 출고에 포함된 총 상품(옵션) 수량
   */
  totalEa: number;
}

export type FmOrderExport = FmOrderExportBase & {
  /**
   * 출고에 포함된 상품옵션 정보
   */
  itemOptions: FmOrderExportItemOption[];
};

export interface FmOrderExportItemOption {
  /**
   * 해당 옵션의 상품 이름
   */
  goods_name: string;
  /**
   * 해당 옵션의 상품 이미지
   */
  image: string;
  /**
   * 출고 아이템 옵션 고유 번호
   */
  item_option_seq: string | number;
  /**
   * 금액 (numberstring)
   */
  price: string;
  /**
   * 상태
   */
  step: FmOrder['step'];
  /**
   * 출고 상품(옵션) 개수
   */
  ea: number;
  /**
   * 출고 옵션 명
   */
  title1: string;
  /**
   * 출고 옵션 값
   */
  option1: string;
  /**
   * 출고 옵션이 색상인 경우 색상 16진수값
   */
  color?: string;
}

/**
 * 주문 상세 정보 (메타정보)
 */
export type FmOrderMetaInfo = Pick<
  FmOrder,
  | 'order_seq'
  | 'regist_date'
  | 'sitetype'
  | 'depositor'
  | 'deposit_date'
  | 'settleprice'
  | 'step'
  | 'order_user_name'
  | 'order_phone'
  | 'order_cellphone'
  | 'order_email'
  | 'recipient_user_name'
  | 'recipient_phone'
  | 'recipient_cellphone'
  | 'recipient_email'
  | 'recipient_zipcode'
  | 'recipient_address'
  | 'recipient_address_detail'
  | 'recipient_address_street'
  | 'memo'
> & {
  /** 주문아이디 */
  id: FmOrder['order_seq'];
} & {
  /**
   * 배송비
   */
  shipping_cost: string;
  /**
   * 배송비
   */
  delivery_cost: string;
  /**
   * 배송 방식 이름
   */
  shipping_set_name: string;
  /**
   * 배송비 결제 방식
   * - free = 무료
   * - prepay = 선불 - 주문시결제
   * - postpaid = 착불
   */
  shipping_type: 'free' | 'prepay' | 'postpaid';
  /**
   * 배송방법
   * delivery = 택배
   * postpaid = 택배착불
   * each_delivery = 택배
   * each_postpaid = 택배착불
   * quick = 퀵서비스
   * direct_delivery = 직접배송
   * direct_store = 매장수령
   * freight = 화물배송
   * direct = 직접수령
   * coupon = 티켓
   * */
  shipping_method:
    | 'delivery'
    | 'postpaid'
    | 'each_delivery'
    | 'each_postpaid'
    | 'quick'
    | 'direct_delivery'
    | 'direct_store'
    | 'freight'
    | 'direct'
    | 'coupon';
  /** 배송그룹 */
  shipping_group: string;
} & {
  memoOriginal: string | null;
};

export interface FmOrderRefundBase {
  /**
   * 환불 코드
   */
  refund_code: string;
  /**
   * 환불 구분
   * - cancel_payment = 결제취소
   * - return = 반품환불
   * - shipping_price = 배송비환불
   */
  refund_type: 'cancel_payment' | 'return' | 'shipping_price';
  /**
   * 환불 접수일
   */
  regist_date: string;
  /**
   * 환불 완료 날짜
   */
  refund_date: string;
  /**
   * 환불 처리 상태
   */
  status: 'request' | 'ing' | 'complete';
  /**
   * 환불 처리 완료 관리자 아이디
   */
  manager_id: string;
  /**
   * 환불 처리 완료 관리자 이메일
   */
  memail: string;
  /**
   * 환불 처리 완료 관리자 전화번호
   */
  mcellphone: string;
  /**
   * 총 환불 상품(옵션) 개수
   */
  totalEa: string;
  /**
   * 총 환불 상품(옵션) 가격
   */
  refund_goods_price: string;
  /**
   * 환불 사유
   */
  refund_reason: string;
}

export interface FmOrderRefundItemBase {
  /** 상품 이름 */
  goods_name: string;
  /** 상품 이미지 */
  image: string;
  /** 환불 주문 상품 고유번호 */
  refund_item_seq: string | number;
  /** 주문 상품 고유번호 */
  item_seq: string | number;
  /** 주문 상품 옵션 고유번호 */
  option_seq: string | number;
  /** 환불 주문 상품 옵션 개수 */
  ea: number;
}

export type FmOrderRefundItem = FmOrderRefundItemBase &
  Pick<
    FmOrderOption,
    | 'item_option_seq'
    | 'title1'
    | 'option1'
    | 'ea'
    | 'step'
    | 'member_sale'
    | 'mobile_sale'
    | 'color'
    | 'price'
    | 'ori_price'
  >;

export type FmOrderRefund = FmOrderRefundBase & {
  /**
   * 반품 상품 옵션 목록
   */
  items: FmOrderRefundItem[];
};

export interface FmOrderReturnBase {
  /**
   * 반품 코드
   */
  return_code: string;
  /**
   * 환불 코드 - 환불이 포함된 경우
   */
  refund_code: string;
  /**
   * 반품 타입 (return: 반품, exchange: 맞교환)
   */
  return_type: 'return' | 'exchange';
  /**
   * 반품 처리 완료 관리자 아이디
   */
  manager_id: string;
  /**
   * 반품 처리 완료 관리자 이메일
   */
  memail: string;
  /**
   * 반품 처리 완료 관리자 전화번호
   */
  mcellphone: string;
  /**
   * 반품 처리 수량 (number string)
   */
  ea: string;
  /**
   * 반품 처리 상태
   */
  status: 'request' | 'ing' | 'complete';
  /**
   * 반품 접수 일시 (date string)
   */
  regist_date: string;
  /**
   * 반품 완료 일시 (date string)
   */
  return_date: string;
  /**
   * 선택한 반품/환불 사유
   */
  reason_desc: string;
  /**
   * 반품 상세 사유 (직접입력)
   */
  return_reason: string;
  /**
   * 반품방법 (user: 고객이 배송, shop: 상점이 회수)
   */
  return_method: 'user' | 'shop';
  /**
   * 회수지 우편번호
   */
  sender_zipcode: string;
  /**
   * 회수지 주소 도로명/지번 구분
   */
  sender_address_type: 'street' | 'zibun';
  /**
   * 회수지 주소
   */
  sender_address: string;
  /**
   * 회수지 도로명주소
   */
  sender_address_street: string;
  /**
   * 회수지 주소 상세
   */
  sender_address_detail: string;
  /**
   * 반송자 전화번호
   */
  phone: string;
  /**
   * 반송자 폰번호
   */
  cellphone: string;
}

export interface FmOrderReturnItemBase {
  /** 상품 이름 */
  goods_name: string;
  /** 상품 이미지 */
  image: string;
  /**
   * 반품 상품 고유 번호
   */
  return_item_seq: number;
  /**
   * 반품 상품 코드
   */
  item_seq: number;
  /**
   * 반품 상품 옵션 코드 (fm_order_item_option.item_option_seq)
   */
  option_seq: number;
  /**
   * 반품 개수
   */
  ea: number;
  /**
   * 반품 사유
   */
  reason_desc: string;
}

export type FmOrderReturnItem = FmOrderReturnItemBase &
  Pick<
    FmOrderOption,
    | 'item_option_seq'
    | 'title1'
    | 'option1'
    | 'ea'
    | 'step'
    | 'member_sale'
    | 'mobile_sale'
    | 'color'
    | 'price'
    | 'ori_price'
  >;

export type FmOrderReturn = FmOrderReturnBase & {
  /**
   * 환불 상품 옵션 목록
   */
  items: Array<FmOrderReturnItem>;
};

/**
 * 상품 상세 정보 반환 데이터 타입
 */
export type FindFmOrderDetailRes = FmOrderMetaInfo & {
  items: Array<FmOrderItem & { options: FmOrderOption[] }>;
  exports?: FmOrderExport[];
  refunds?: FmOrderRefund[];
  returns?: FmOrderReturn[];
};
