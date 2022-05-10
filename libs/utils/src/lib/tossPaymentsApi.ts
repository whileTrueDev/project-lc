import axios from 'axios';
import { nanoid } from 'nanoid';

/** 토스페이먼츠 결제취소 위해 필요한 결제정보와 transactionKey 생성 위해 만듦
 * 테스트용으로 만든거라 안쓰이는 경우 삭제필요
 */

const ENCODED_SECRET_KEY = Buffer.from(`${process.env.PAYMENTS_SECRET_KEY}:`).toString(
  'base64',
);

const axiosConfig = {
  headers: {
    Authorization: `Basic ${ENCODED_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
};

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
