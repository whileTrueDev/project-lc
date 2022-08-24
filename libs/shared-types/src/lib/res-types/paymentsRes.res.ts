/** 거래내역 조회 응답 */
export interface PaymentTransaction {
  mId: string; // 가맹정 ID
  transactionKey: string; // 거래건에 대한 고유한 키값, 결제 한 건에 대한 승인과 취소 거래를 구분할 때 사용
  paymentKey: string; // 결제 건에 대한 고유 키값
  orderId: string; // 가맹점에서 주문건에 대해 발급한 고유 ID입니다.
  method: string; // 결제 수단
  customerKey: string | null; // 고객 ID
  useEscrow: boolean; // 에스크로 사용여부
  receiptUrl: string; //
  status: // 결제 처리 상태
  | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELLED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';
  transactionAt: string; // 거래가 처리된 시점의 datetime yyyy-MM-ddTHH:mm:ss±hh:mm
  currency: string; // 통화
  amount: number; // 결제액
}

export type PaymentCard = {
  company: string;
  number: string;
  installmentPlanMonths: number;
  isInterestFree: boolean;
  interestPayer: null | string;
  approveNo: string;
  useCardPoint: boolean;
  cardType: string;
  ownerType: string;
  acquireStatus: string;
  receiptUrl: string;
  provider: null | string;
};

export type PaymentVirtualAccount = {
  accountType: string;
  accountNumber: string;
  bank: string;
  customerName: string;
  dueDate: string;
  refundStatus: 'NONE' | 'FAILED' | 'PENDING' | 'PARTIAL_FAILED' | 'COMPLETED';
  expired: boolean;
  settlementStatus: string;
};

export type PaymentMobilePhone = {
  carrier: string;
  customerMobilePhone: string;
  settlementStatus: string;
  receiptUrl: string;
};

export type PaymentGiftCertificate = {
  approveNo: string;
  settlementStatus: string;
};

export type PaymentTransfer = {
  bank: string;
  settlementStatus: string;
};

export type PaymentFailure = {
  code: string;
  message: string;
};

export type PaymentCashReceipt = {
  type: string;
  amount: number;
  taxFreeAmount: number;
  issueNumber: string;
  receiptUrl: string;
};

export type PaymentDiscount = {
  amount: number;
};

export interface Payment {
  version: string;
  paymentKey: string;
  type: string;
  orderId: string;
  orderName: string;
  mId: string;
  currency: string;
  method: string;
  totalAmount: number;
  balanceAmount: number;
  status:
    | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELLED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  transactionKey: string;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  /** 결제 취소 이력이 담기는 배열입니다. */
  cancels: null | TossPaymentCancel[];
  isPartialCancelable: boolean;
  card: null | PaymentCard;
  virtualAccount: null | PaymentVirtualAccount;
  secret: null | string;
  mobilePhone: null | PaymentMobilePhone;
  giftCertificate: null | PaymentGiftCertificate;
  transfer: null | PaymentTransfer;
  easyPay: null | string;
  country: string;
  failure: null | PaymentFailure;
  cashReceipt: null | PaymentCashReceipt;
  discount: null | PaymentDiscount;
}

/** 결제 취소 이력 */
export interface TossPaymentCancel {
  /** 결제를 취소한 금액입니다. */
  cancelAmount: number;
  /**  결제를 취소한 이유입니다. */
  cancelReason: string;
  /** 취소된 금액 중 면세 금액입니다. */
  taxFreeAmount: number;
  /** 과세 처리된 금액입니다. */
  taxAmount: null | number;
  /** 결제 취소 후 환불 가능한 잔액입니다. */
  refundableAmount: number;
  /** 결제 취소가 일어난 날짜와 시간 정보입니다. ISO 8601 형식인 yyyy-MM-dd'T'HH:mm:ss±hh:mm입니다. (e.g. 2022-01-01T00:00:00+09:00) */
  canceledAt: string;
  /** 취소 건에 대한 고유한 키 값입니다. 여러 건의 취소 거래를 구분하는데 사용됩니다. */
  transactionKey: string;
}

/** 결제취소 응답 */
export interface PaymentCancelRequestResult extends Record<string, any> {
  transactionKey: string;
}
