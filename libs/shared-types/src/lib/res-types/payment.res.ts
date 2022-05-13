// 타입 설명 : https://docs.tosspayments.com/reference#payment-%EA%B0%9D%EC%B2%B4

export interface Cancels {
  cancelsAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxAmount: number | null;
  refundableAmount: number;
  canceledAt: string;
}

export interface Card {
  company: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  useCardPoint: boolean;
  cardType: '신용' | '체크' | '기프트';
  ownerType: '개인' | '법인';
  receiptUrl: string;
  acquireStatus: 'READY' | 'REQUESTED' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELED';
  isInteresFree: boolean;
  interestPayer: 'BUYER' | 'CARD_COMPANY' | 'MERCHANT';
  provider: null;
}

export interface VirtualAccount {
  accountType: '일반' | '고정';
  accountNumber: string;
  bank: string;
  customerName: string;
  dueDate: string;
  refundStatus: string;
  expired: boolean;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface MobilePhone {
  carrier: string;
  customerMobilePhone: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
  receiptUrl: string;
}

export interface GiftCertificate {
  approveNo: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface Transfer {
  bank: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface Failure {
  code: string;
  message: string;
}

export interface CashReceipt {
  type: string;
  amount: number;
  taxFreeAmount: number;
  issueNumber: string;
  receiptUrl: string;
}

export interface Discount {
  amount: number;
}

export interface PaymentResType {
  version: string; // Payment 객체의 응답 버전입니다.
  paymentKey: string; // 결제 건에 대한 고유한 키 값입니다.
  type: 'NORMAL' | 'BILLING' | 'CONNECTPAY'; // 일반결제 | 자동결제 | 커넥트페이
  orderId: string; // 가맹점에서 주문건에 대해 발급한 고유 ID입니다.
  orderName: string; // 결제에 대한 주문명입니다. 예를 들면 생수 외 1건 같은 형식입니다. 최소 1글자 이상 100글자 이하여야 합니다.
  mId: string; // 가맹점ID
  currency: string; // 통화단위(KRW만 사용됨)
  method: '카드' | '가상계좌' | '계좌이체'; // 결제할 때 사용한 결제 수단입니다. 카드, 가상계좌, 휴대폰, 계좌이체, 상품권(문화상품권, 도서문화상품권, 게임문화상품권) 중 하나입니다.
  totalAmount: number; // 총 결제금액
  balanceAmount: number; // 취소할 수 있는 금액
  status: /**
  * 결제 처리 상태입니다. 아래와 같은 상태값을 가질 수 있습니다.
   READY - 준비됨
   IN_PROGRESS - 진행중
   WAITING_FOR_DEPOSIT - 가상계좌 입금 대기 중
   DONE - 결제 완료됨
   CANCELED - 결제가 취소됨
   PARTIAL_CANCELED - 결제가 부분 취소됨
   ABORTED - 카드 자동 결제 혹은 키인 결제를 할 때 결제 승인에 실패함
   EXPIRED - 유효 시간(30분)이 지나 거래가 취소됨
  */
  | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELLED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';
  requestedAt: string; // 결제 요청 날짜 2022-01-01T00:00:00+09:00
  approvedAt: string; // 결제 승인 날짜 2022-01-01T00:00:00+09:00
  useEscrow: boolean; // 에스크로 사용여부
  transactionKey: string; // 거래 건에 대한 고유한 키 값입니다. 결제 한 건에 대한 승인 거래와 취소 거래를 구분하는데 사용됩니다.
  suppliedAmount: number; // 공급가액입니다.
  vat: number; // 부가세입니다. (결제 금액 amount - 면세 금액 taxFreeAmount) / 11 후 소수점 첫째 자리에서 반올림해서 계산합니다.
  cultureExpense: boolean; // 문화비로 지출헀는지 여부
  taxFreeAmount: number; // 전체 결제 금액 중 면세 금액입니다. 값이 0으로 돌아왔다면 전체 결제 금액이 과세 대상입니다.
  cancels: null | Cancels[]; // 결제 취소 이력
  isPartialCancelable: boolean; // 부분 취소 가능 여부, false일시 전체 금액만 취소가능
  card: Card | null; // 카드로 결제하면 제공되는 카드 관련 정보입니다.
  virtualAccount: VirtualAccount | null; // 가상계좌로 결제하면 제공되는 가상계좌 관련 정보입니다.
  secret: string | null; // 가상계좌로 결제할 때 전달되는 입금 콜백을 검증하기 위한 값입니다.
  mobilePhone: null | MobilePhone; // 휴대폰으로 결제하면 제공되는 휴대폰 결제 관련 정보입니다.
  giftCertificate: GiftCertificate | null; // 상품권으로 결제하면 제공되는 상품권 결제 관련 정보입니다.
  transfer: null | Transfer; // 계좌이체로 결제했을 때 이체 정보가 담기는 객체입니다.
  easyPay: string | null; // 간편결제로 결제한 경우 간편결제 타입 정보입니다. 토스결제, 삼성페이, 카카오페이, 페이코 같은 형태입니다.
  country: string; // 결제한 국가 정보입니다. ISO-3166의 두 자리 국가 코드 형식입니다.
  failure: Failure | null; // 에러 메시지입니다. 에러 발생 이유를 알려줍니다.
  cashReceipt: CashReceipt | null; // 현금영수증 정보입니다.
  discount: null | Discount; // 카드사의 즉시 할인 프로모션 정보입니다. 즉시 할인 프로모션이 적용됐을 때만 생성됩니다.
}
