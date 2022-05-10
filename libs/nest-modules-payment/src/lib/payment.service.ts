import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentByOrderId,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import axios, { AxiosRequestConfig } from 'axios';

type PaymentsByDateRequestType = {
  startDate: string;
  endDate: string;
  startingAfter: string;
  limit: number;
};

@Injectable()
export class PaymentService {
  private BASE_URL = 'https://api.tosspayments.com/v1';
  private PAYMENTS_SECRET_KEY: string;
  private axiosConfigHeaders: AxiosRequestConfig['headers'];
  constructor(private readonly configService: ConfigService) {
    this.PAYMENTS_SECRET_KEY = this.configService.get('PAYMENTS_SECRET_KEY');
    this.axiosConfigHeaders = {
      Authorization: `Basic ${Buffer.from(`${this.PAYMENTS_SECRET_KEY}:`).toString(
        'base64',
      )}`,
      'Content-Type': 'application/json',
    };
  }

  /** 결제승인 요청 API */
  async createPayment(dto): Promise<boolean> {
    return axios
      .post(
        `${this.BASE_URL}/payments/${dto.paymentKey}`,
        {
          orderId: dto.orderId,
          amount: dto.amount,
        },
        {
          responseType: 'json',
          headers: this.axiosConfigHeaders,
        },
      )
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  /** 주문번호별 결제내역 */
  async getPaymentByOrderId(orderId: string): Promise<PaymentByOrderId> {
    return axios
      .get(`${this.BASE_URL}/payments/orders/${orderId}`, {
        headers: this.axiosConfigHeaders,
      })
      .then((v) => {
        return v.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  /** 날짜 기간 거래내역 */
  async getPaymentsByDate(dto: PaymentsByDateRequestType): Promise<PaymentTransaction> {
    return axios
      .get(`${this.BASE_URL}/transactions`, {
        params: {
          startDate: dto.startDate,
          endDate: dto.endDate,
          startingAfter: dto.startingAfter,
          limit: dto.limit,
        },
        headers: this.axiosConfigHeaders,
        responseType: 'json',
      })
      .then((v) => {
        return v.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  /** 토스페이먼츠 결제취소요청 */
  async requestCancelTossPayment({
    paymentKey,
    cancelReason,
    cancelAmount,
  }: TossPaymentCancelDto): Promise<any> {
    try {
      const postData = {
        cancelReason,
        cancelAmount,
      };
      const url = `${this.BASE_URL}/payments/${paymentKey}/cancel`;
      const response = await axios.post(url, postData, {
        headers: this.axiosConfigHeaders,
      });
      return response.data;
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        error.response.message || 'error in requestCancelTossPayment',
        error.response.status || 500,
      );
    }
  }
}
