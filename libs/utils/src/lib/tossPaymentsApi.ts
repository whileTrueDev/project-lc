import axios from 'axios';
import { nanoid } from 'nanoid';

const ENCODED_SECRET_KEY = Buffer.from(`${process.env.PAYMENTS_SECRET_KEY}:`).toString(
  'base64',
);

const axiosConfig = {
  headers: {
    Authorization: `Basic ${ENCODED_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

export interface TossPaymentCancelDto {
  paymentKey: string;
  cancelReason: string;
  /** 취소금액 - 값이 없는경우 전액 취소처리 */
  cancelAmount?: number;
  /** 현재 환불 가능한 금액입니다. 취소 요청을 안전하게 처리하기 위해서 사용합니다.
    환불 가능한 잔액 정보가 refundableAmount의 값과 다른 경우 해당 요청을 처리하지 않고 에러를 내보냅니다.  */
  refundableAmount?: number;
  /** 결제 취소 후 금액이 환불될 계좌의 정보입니다. 가상계좌 결제에 대해서만 필수입니다. 다른 결제 수단으로 이루어진 결제를 취소할 때는 사용하지 않습니다. */
  refundReceiveAccount?: {
    /** 취소 금액을 환불받을 계좌의 은행 코드입니다. 은행 코드(https://docs.tosspayments.com/reference/codes#%EC%9D%80%ED%96%89-%EC%BD%94%EB%93%9C)를 참고 */
    bank: string;
    /** 취소 금액을 환불받을 계좌의 계좌번호 입니다. - 없이 숫자만 넣어야 합니다. */
    accountNumber: string;
    /** 취소 금액을 환불받을 계좌의 예금주 이름입니다. */
    holderName: string;
  };
}
/** 토스페이먼츠 결제취소요청 */
export const requestTossPaymentCancel = async ({
  paymentKey,
  cancelReason,
  cancelAmount,
}: TossPaymentCancelDto): Promise<any> => {
  const postData = {
    cancelReason,
    cancelAmount,
  };
  const url = `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`;
  const response = await axios.post(url, postData, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 결제취소 위해 필요한 결제정보와 transactionKey 생성 위해 만들었음. 테스트용으로 만든거라 안쓰이는 경우 삭제필요
 */
export const makeDummyTossPaymentData = async (): Promise<any> => {
  const orderId = nanoid(6);
  const postData = {
    amount: 15000,
    orderId,
    orderName: '테스트주문',
    cardNumber: '4330123412341234',
    cardExpirationYear: '24',
    cardExpirationMonth: '07',
    cardPassword: '12',
    customerIdentityNumber: '881212',
  };

  const url = 'https://api.tosspayments.com/v1/payments/key-in';
  const response = await axios.post(url, postData, axiosConfig);
  return response.data;
};
