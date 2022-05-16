import { Exchange, ExchangeItem, Export, Order } from '@prisma/client';
import { ExchangeReturnCancelItemBaseData } from './orderCancellation.res';

export type CreateExchangeRes = Exchange;

export type ExchangeItemData = ExchangeReturnCancelItemBaseData & {
  /** 교환상품 고유번호 */
  id: ExchangeItem['id'];
  /** 교환상품 개수 */
  amount: ExchangeItem['amount'];
  /** 교환상품 처리 상태 */
  status: ExchangeItem['status'];
};
export type ExchangeData = Omit<Exchange, 'exchangeItems'> & {
  export: Export;
  order: { orderCode: Order['orderCode'] };
  items: ExchangeItemData[];
};
export type ExchangeListRes = {
  list: ExchangeData[];
  totalCount: number;
  nextCursor?: number;
};

export type ExchangeDetailRes = any;

export type ExchangeUpdateRes = boolean;

export type ExchangeDeleteRes = boolean;
