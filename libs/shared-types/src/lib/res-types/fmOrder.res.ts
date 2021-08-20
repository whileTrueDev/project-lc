/* eslint-disable camelcase */

// * 주문
export interface FmOrder {
  order_seq: number; // '고유번호'
  orign_order_seq: number | null; // '맞교환주문의 원주문번호'
  top_orign_order_seq: number | null; // '현주문의 최상단'
  member_seq: number | null; // '회원 고유번호'
  person_seq: number | null; // '개인결제 고유번호'
  original_settleprice: string; // '에누리미적용금액'
  settleprice: string; // '실결제금액'
  payment_price: string | null; // '결제금액(결제통화기준)'
  freeprice: string | null; // '비과세금액'
  tax_rate: string | null; // '부가세율'
  enuri: string; // '에누리',
  step: string; // '주문상태',
  log: string | null; // '로그',
  deposit_yn: 'y' | 'n'; // '입금상태',
  deposit_date: Date | null; // '입금일시',
  depositor: string | null; // '입금자명',

  bank_account: string | null; // '입금계좌정보',
  virtual_account: string | null; // '가상계좌정보',
  virtual_date: string; // '가상계좌입금제한일',
  pg_transaction_number: string | null; // 'PG고유번호',
  pg_approval_number: string | null; // '신용카드승인번호',
  cash_receipts_no: string; // '현금영수증번호',
  pg_currency: string; // 'PG결제통화',
  pg_currency_exchange_rate: string | null; // 'PG환율(결제통화기준)',
  pg_currency_exchange: string | null; // 'PG환율(결제당시)',
  emoney_use: 'none' | 'use' | 'return' | null; // '적립금사용여부',
  emoney: string | null; // '적립금사용금액',
  cash_use: 'none' | 'use' | 'return' | null; // '이머니사용여부',
  cash: string | null; // '이머니사용금액',
  order_user_name: string; // '주문자명',
  order_phone: string | null; // '주문자전화',
  order_cellphone: string; // '주문자휴대폰',
  order_email: string; // '주문자이메일',
  recipient_user_name: string | null; // '받는자명',
  recipient_phone: string | null; // '받는자전화',
  recipient_cellphone: string | null; // '받는자휴대폰',
  shipping_method: string | null; // '배송방법',
  shipping_cost: string; // '배송비결제금액',
  postpaid: string | null; // '착불배송비',
  delivery_if: string | null; // '배송비무료조건 금액',
  delivery_cost: string | null; // '기본배송비',
  recipient_zipcode: string | null; // '배송지우편번호',
  recipient_address_type: 'street' | 'zibun'; // '도로명-지번 주소구분',
  recipient_address: string | null; // '배송지주소',
  recipient_address_street: string | null; // '도로명주소',
  recipient_address_detail: string | null; // '배송지주소상세',
  recipient_address_street_gf: string | null; // '도로명주소 goodsflow 용',
  international: 'domestic' | 'international'; // '국제배송여부(domestic:국내,international:해외)',

  shipping_method_international: string | null; // '해외배송방법',
  region: string | null; // '지역',
  nation_key: string | null; // '국가KEY',
  international_address: string | null; // '주소',
  international_town_city: string | null; // '도시',
  international_county: string | null; // '군',
  international_postcode: string | null; // '우편번호',
  international_country: string | null; // '국가',
  international_cost: string; // '해외배송비',
  memo: string | null; // '배송메시지',
  each_msg_yn: string | null; // '개별배송메세지 사용여부',
  admin_memo: string | null; // '관리자메모',
  download_seq: number | null; // '사용쿠폰 일련번호',
  coupon_sale: number | null; // '쿠폰할인금액',
  typereceipt: number | null; // '매출증빙',
  pg: string | null; // 'PG사 명',
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
    | null; // enum('card','bank','account','cellphone','virtual','escrow_virtual','escrow_account','point','paypal','kakaomoney','payco_coupon','pos_pay','pay_later')

  mode: string; // '구매방식(direct:바로구매, cart:장바구니구매, admin:관리자구매)',
  regist_date: Date; // '주문접수일',
  session_id: string; // '세션아이디',
  important: '0' | '1'; // '중요체크',
  sitetype: 'P' | 'M' | 'F' | 'OFFLINE' | 'OFFLINEM' | 'APP_ANDROID' | 'APP_IOS' | 'POS'; // '판매환경',
  marketplace: string | null; // '유입매체',
  hidden: 'N' | 'Y' | 'T'; // '주문삭제여부',
  hidden_date: Date | null; // '주문삭제일시',
  admin_order: string; // '관리자주문시 관리자아이디',
  sms_25_YN: 'Y' | 'N'; // '결제확인SMS발송여부',
  recipient_email: string | null; // '받는사람이메일',
  curation_inflow: string | null; // '고객리마인드서비스유입구분',
  curation_seq: number | null; // '고객리마인드서비스유입로그',
  skintype: 'P' | 'M' | 'F' | 'OFF_P' | 'OFF_M' | 'OFF_F'; // 'SKIN환경',
  referer: string | null; // '유입경로 full url',
  referer_domain: string | null; // '유입경로 domain',
  sms_15_YN: string | null; // '주문SMS발송여부',
  linkage_id: string | null; // '연동업체코드',
  linkage_order_id: string | null; // '연동업체 주문번호',
  linkage_mall_order_id: string | null; // '연동마켓 주문번호',
  linkage_mall_code: string | null; // '연동몰 코드',
  linkage_order_reg_date: null; // '연동 수집 일시'
  npay_order_id: string | null; // 'npay 주문번호'
  npay_orderer_id: string | null; // 'npay 사용자 id'
  npay_order_pay_date: string | null; // 'Npay 결제 일시'
  sns_rute: string | null; // 'sns로그인'
  total_ea: number; // '총주문수량'
  total_type: number; // '총상품종류'
  clearance_unique_personal_code: string | null; // '개인통관부호'
  accumul_mark: string | null; // '수집데이터 체크'
  ip: string | null; // '아이피'
  bundle_yn: 'y' | 'n'; // '묶음배송여부'
  blacklist: number | null; // '악성고객정보'
  skin_seq: number; // '구입시 적용 스킨 번호'
  npay_server_info: string | null; // 'Npay 연동 서버정보(TEST/REAL)'
  npay_order_date: string | null; // 'Npay 주문 일시'
  npay_point: number | null; // 'Npay포인트사용액(네이버부담)'
  paypal_token: string | null; // 'Paypal 결제 Token'
  krw_exchange_rate: number | null; // '원화(KRW) 환율'
  autodeposit_key: number | null; // '무통장입금확인 키'
  autodeposit_type: string | null; // '무통장입금확인 타입'
  payment_type: string | null; // '결제구분(shop/pg/오픈마켓/kakaopay 외 결제업체)'
  ordersheet_seq: number | null; // '주문서쿠폰발급번호'
  ordersheet_sale: string | null; // '주문서쿠폰할인금액'
  ordersheet_sale_krw: number | null; // '주문서쿠폰할인금액(원화기준)'
  talkbuy_order_id: string | null; // '톡구매 주문번호'
  talkbuy_order_date: Date | null; // '톡구매 주문일시'
  talkbuy_paid_date: Date | null; // '톡구매 결제일시'
}

// * 주문 상품
export interface FmOrderItem {
  item_seq: number; // '고유번호',
  shipping_seq: number | null; // '다중배송지고유번호',
  provider_seq: number; // '입점사고유번호',
  goods_seq: number; // '상품고유번호',
  order_seq: number; // '주문번호',
  goods_code: string | null; // '상품코드',
  image: string | null; // '상품이미지경로',
  goods_name: string; // '상품명',
  goods_shipping_cost: string; // '개별배송비',
  shipping_policy: 'goods' | 'shop'; // '배송정책(개별배송비,기본배송비)',
  shipping_unit: number | null; // '합포장단위',
  basic_shipping_cost: string; // '기본포장 배송비',
  add_shipping_cost: string; // '추가포장배송비',
  multi_discount_ea: number | null; // '복수구매할인수량',
  tax: 'tax' | 'exempt' | 'none'; // '부가세',
  provider_name: string | null; // '입점사명',
  account_date: Date | null; //  '정산일자',
  individual_refund: '1' | '0'; // '개별취소가능 여부',
  individual_refund_inherit: '0' | '1'; // '본상품취소시 함께취소 여부',
  individual_export: '1' | '0'; // '개별출고가능 여부',
  individual_return: '1' | '0'; // '개별반품교환가능 여부',
  account_2round: string | null; // '정산2',
  account_4round: string | null; // '정산4',
  goods_type: 'goods' | 'gift'; // '상품타입(goods:상품,gift:사은품)',
  event_seq: number | null; // '할인이벤트 고유번호',
  goods_kind: 'goods' | 'coupon'; // '실물상품, 쿠폰',
  adult_goods: string; // '성인상품여부',
  socialcp_input_type: 'price' | 'pass'; // '1장값어치:금액(price), 횟수(pass)',
  socialcp_use_return: '0' | '1'; // '미사용환불대상여부',
  socialcp_use_emoney_day: number; // '취소(환불)-이내 또는 전까지',
  socialcp_use_emoney_percent: number; // '취소(환불)-취소율',
  social_goods_group: number; // '쿠폰상품그룹',
  linkage_order_id: string | null; // '연동업체 주문번호',
  account_seq: number | null; // '정산일련번호',
  socialcp_cancel_use_refund: '0' | '1'; // '유효기간내-일부사용시 취소(환불)불가여부',
  socialcp_cancel_payoption: '0' | '1'; // '유효기간내-취소(환불)여부',
  socialcp_cancel_payoption_percent: number; // '유효기간내-취소율',
  hscode: string | null; // 'HSCODE',
  option_international_shipping_status: 'y' | 'n'; // '필수옵션 해외배송여부',
  npay_order_id: string | null; // 'Npay 주문 번호',
  reservation_ship: 'y' | 'n'; // '예약발송여부',
  reservation_ship_date: string | null; // '예약발송일',
  referer_domain: string | null; // '유입경로',
  bs_seq: number | null; // '방송 일련번호',
  bs_type: 'live' | 'vod' | null; // '방송 타입',
  talkbuy_order_id: string | null; // '톡구매 주문번호',
}

export type FindFmOrderRes = FmOrder & { id: FmOrder['order_seq'] };
