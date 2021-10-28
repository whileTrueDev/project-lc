import { Decimal } from '@prisma/client/runtime';
import { Prisma } from '.prisma/client';

export type FindSettlementHistoryRoundRes = (Prisma.PickArray<
  Prisma.SellerSettlementsGroupByOutputType,
  'round'[]
> & {
  _sum: {
    totalPrice: number;
    totalAmount: number;
    totalCommission: number;
    pgCommission: number;
    totalEa: number;
    shippingCost: Decimal | string;
  };
})[];
