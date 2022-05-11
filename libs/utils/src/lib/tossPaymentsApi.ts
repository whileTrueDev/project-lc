import {
  PaymentByOrderId,
  PaymentRequestDto,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import axios from 'axios';
import { nanoid } from 'nanoid';

const ENCODED_SECRET_KEY = Buffer.from(`${process.env.PAYMENTS_SECRET_KEY}:`).toString(
  'base64',
);

/** 토스페이먼츠 api 요청시 필요한 헤더값  https://docs.tosspayments.com/guides/apis/usage#%EC%9D%B8%EC%A6%9Dauthorization */
const axiosConfig = {
  headers: {
    Authorization: `Basic ${ENCODED_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

const BASE_URL = 'https://api.tosspayments.com/v1';

export type PaymentsByDateRequestType = {
  startDate: string;
  endDate: string;
  startingAfter: string;
  limit: number;
};
/** 토스페이먼츠 결제취소 위해 필요한 결제정보와 transactionKey 생성 위해 만듦
 * 테스트용으로 만든거라 안쓰이는 경우 삭제필요
 */
const makeDummyTossPaymentData = async (): Promise<any> => {
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

  const url = `${BASE_URL}/payments/key-in`;
  const response = await axios.post(url, postData, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 결제취소요청 */
const requestCancelPayment = async ({
  paymentKey,
  cancelReason,
  cancelAmount,
}: TossPaymentCancelDto): Promise<any> => {
  const postData = {
    cancelReason,
    cancelAmount,
  };
  const url = `${BASE_URL}/payments/${paymentKey}/cancel`;
  const response = await axios.post(url, postData, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 주문번호(order.orderCode)로 결제내역조회 */
const getPaymentByOrderId = async (orderId: string): Promise<PaymentByOrderId> => {
  const url = `${BASE_URL}/payments/orders/${orderId}`;
  const response = await axios.get(url, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 결제승인 요청 API */
const createPayment = async (dto: PaymentRequestDto): Promise<any> => {
  const postData = {
    orderId: dto.orderId,
    amount: dto.amount,
  };
  const url = `${BASE_URL}/payments/${dto.paymentKey}`;
  const response = await axios.post(url, postData, {
    responseType: 'json',
    ...axiosConfig,
  });
  return response.data;
};

/** 토스페이먼츠 거래내역 조회 - 날짜 기간 */
const getPaymentsByDate = async (
  dto: PaymentsByDateRequestType,
): Promise<PaymentTransaction> => {
  const url = `${BASE_URL}/transactions`;
  const params = {
    startDate: dto.startDate,
    endDate: dto.endDate,
    startingAfter: dto.startingAfter,
    limit: dto.limit,
  };
  const response = await axios.get(url, {
    params,
    responseType: 'json',
    ...axiosConfig,
  });
  return response.data;
};

export const TossPaymentsApi = {
  makeDummyTossPaymentData,
  requestCancelPayment,
  getPaymentByOrderId,
  createPayment,
  getPaymentsByDate,
};

export default TossPaymentsApi;
