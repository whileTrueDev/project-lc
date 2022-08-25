import { Order } from '@prisma/client';
import {
  Payment,
  PaymentRequestDto,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import axios from 'axios';

const ENCODED_SECRET_KEY = Buffer.from(
  `${process.env.TOSS_PAYMENTS_SECRET_KEY}:`,
).toString('base64');

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

/** 토스페이먼츠 결제취소요청 - 응답 Payment객체의 cancels 필드에 취소객체가 배열로 들어옴 */
const requestCancelPayment = async (dto: TossPaymentCancelDto): Promise<Payment> => {
  const url = `${BASE_URL}/payments/${dto.paymentKey}/cancel`;
  const response = await axios.post(url, dto, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 주문번호(order.orderCode)로 결제내역조회 */
const getPaymentByOrderCode = async (orderCode: Order['orderCode']): Promise<Payment> => {
  const url = `${BASE_URL}/payments/orders/${orderCode}`;
  const response = await axios.get(url, axiosConfig);
  return response.data;
};

/** 토스페이먼츠 결제승인 요청 API */
const createPayment = async (dto: PaymentRequestDto): Promise<Payment> => {
  const postData = {
    orderId: dto.orderId,
    amount: dto.amount,
    paymentKey: dto.paymentKey,
  };
  const url = `${BASE_URL}/payments/confirm`;
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
  requestCancelPayment,
  getPaymentByOrderCode,
  createPayment,
  getPaymentsByDate,
};

export default TossPaymentsApi;
