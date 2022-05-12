import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentByOrderId, PaymentTransaction } from '@project-lc/shared-types';
import axios from 'axios';

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
  constructor(private readonly configService: ConfigService) {
    this.PAYMENTS_SECRET_KEY = this.configService.get('PAYMENTS_SECRET_KEY');
  }

  /** 결제승인 요청 API */
  async createPayment(dto): Promise<any> {
    return axios
      .post(
        `${this.BASE_URL}/payments/${dto.paymentKey}`,
        {
          orderId: dto.orderId,
          amount: dto.amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.PAYMENTS_SECRET_KEY}:`).toString(
              'base64',
            )}`,
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        },
      )
      .then((res) => {
        return res.data;
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
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.PAYMENTS_SECRET_KEY}:`).toString(
            'base64',
          )}`,
        },
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
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.PAYMENTS_SECRET_KEY}:`).toString(
            'base64',
          )}`,
          'Content-Type': 'application/json',
        },
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
}
