import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private BASE_URL = 'https://api.tosspayments.com/v1/payments';
  private PAYMENTS_CLIENT_KEY: string;
  private PAYMENTS_SECRET_KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.PAYMENTS_CLIENT_KEY = this.configService.get('PAYMENTS_CLIENT_KEY');
    this.PAYMENTS_SECRET_KEY = this.configService.get('PAYMENTS_SECRET_KEY');
  }

  async requestPayment(dto): Promise<boolean> {
    return axios
      .post(
        `${this.BASE_URL}/${dto.paymentKey}`,
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
      .then(() => {
        console.log('Success');
        return true;
      })
      .catch((err) => {
        console.log(err, 'Failure');
        console.log(dto.orderId, dto.amount);
        return false;
      });
  }
}
