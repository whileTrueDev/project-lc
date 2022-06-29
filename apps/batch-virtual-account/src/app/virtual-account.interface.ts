import { OrderPayment } from '@prisma/client';

export interface VirtualAccountServiceInterface {
  findOutOfDateVirtualAccountPayment: () => Promise<OrderPayment[]>;
  makePaymentFail: (payment: OrderPayment) => Promise<number | string>;
}
