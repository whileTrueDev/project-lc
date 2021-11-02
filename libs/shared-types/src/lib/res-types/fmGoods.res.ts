export interface FmGoodsOption {
  /** 일련번호  */
  option_seq: number;
  /** 상품일련번호  */
  goods_seq: number;
  /** 옵션코드  */
  code_seq: string | null;
  /** 필수여부  */
  default_option: 'y' | 'n';
  /** direct  */
  option_type: 'direct';
  /** 옵션명  */
  option_title: string | null;
  /** 옵션1 값  */
  option1: string;
  /** 옵션2 값  */
  option2: string;
  /** 옵션3 값  */
  option3: string;
  /** 옵션4 값  */
  option4: string;
  /** 옵션5 값  */
  option5: string;
  /** '옵션코드1  */
  optioncode1: string | null;
  /** '옵션코드2  */
  optioncode2: string | null;
  /** '옵션코드3  */
  optioncode3: string | null;
  /** '옵션코드4  */
  optioncode4: string | null;
  /** '옵션코드5  */
  optioncode5: string | null;
  /** 옵션정보  */
  infomation: string | null;
  /** 소비자가 numberstring  */
  consumer_price: string;
  /** '판매가  */
  price: string;
  /** 적립율  */
  reserve_rate: string;
  /** 적립율단위  */
  reserve_unit: 'won' | 'percent' | 'KRW' | 'USD' | 'CNY' | 'JPY' | 'EUR';
  /** 적립금  */
  reserve: string;
  /** 수수료율  */
  commission_rate: number | null;
  /** 본값 '0,0,0,0,0' '옵션별가격  */
  tmpprice: string;
  /** 색상-주소구분  */
  newtype: string | null;
  /** 색상  */
  color: string | null;
  /** 우편번호  */
  zipcode: string | null;
  /** 도로명-지번 주소구분  */
  address_type: 'street' | 'zibun' | null;
  /** 주소  */
  address: string | null;
  /** 도로명주소  */
  address_street: string | null;
  /** 주소상세  */
  addressdetail: string | null;
  /** 날짜  */
  codedate: Date | string | null;
  /** 수동기간시작  */
  sdayinput: Date | string | null;
  /** 수동기간완료  */
  fdayinput: Date | string | null;
  /** 자동기간시작구분  */
  dayauto_type: 'month' | 'day' | 'next' | null;
  /** 자동기간시작일  */
  sdayauto: number | null;
  /** 자동기간완료일  */
  fdayauto: number | null;
  /** 자동기간완료구분  */
  dayauto_day: 'day' | 'end' | null;
  /** '업체연락처  */
  biztel: string | null;
  /** '쿠폰1장-값어치 횟수-금액  */
  coupon_input: number | null;
  /** '코드  */
  option_code: string | null;
  /** '지역-수수료율  */
  address_commission: number | null;
  /** '고정 고유번호  */
  fix_option_seq: number | null;
  /** 'SACO-수수료방식, SUCO-공급가퍼센트, SUPR-공급가가격  */
  commission_type: 'SACO' | 'SUCO' | 'SUPR';
  /** '패키지상품수  */
  package_count: number | null;
  /** '패키지연결옵션상품명1  */
  package_goods_name1: string | null;
  /** '패키지연결옵션상품명2  */
  package_goods_name2: string | null;
  /** '패키지연결옵션상품명3  */
  package_goods_name3: string | null;
  /** '패키지연결옵션상품명4  */
  package_goods_name4: string | null;
  /** '패키지연결옵션상품명5  */
  package_goods_name5: string | null;
  /** '패키지연결옵션고유번호1  */
  package_option_seq1: number | null;
  /** '패키지연결옵션고유번호2  */
  package_option_seq2: number | null;
  /** '패키지연결옵션고유번호3  */
  package_option_seq3: number | null;
  /** '패키지연결옵션고유번호4  */
  package_option_seq4: number | null;
  /** '패키지연결옵션고유번호5  */
  package_option_seq5: number | null;
  /** '패키지연결옵션1  */
  package_option1: string | null;
  /** '패키지연결옵션2  */
  package_option2: string | null;
  /** '패키지연결옵션3  */
  package_option3: string | null;
  /** '패키지연결옵션4  */
  package_option4: string | null;
  /** '패키지연결옵션5  */
  package_option5: string | null;
  /** '단위수량1  */
  package_unit_ea1: number | null;
  /** '단위수량2  */
  package_unit_ea2: number | null;
  /** '단위수량3  */
  package_unit_ea3: number | null;
  /** '단위수량4  */
  package_unit_ea4: number | null;
  /** '단위수량5  */
  package_unit_ea5: number | null;
  /** '옵션 개당무게 ( 단위 kg )  */
  weight: string;
  /** '옵션 노출 여부(Y : 노출, N : 미노출)  */
  option_view: 'Y' | 'N';
  /** '상품 전체 바코드-트리거로 처리  */
  full_barcode: string | null;
}
