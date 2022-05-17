import { Order, Refund, Return, ReturnImage, ReturnItem } from '@prisma/client';
import { ExchangeReturnCancelItemBaseData } from './orderCancellation.res';

export type CreateReturnRes = Return;

export type ReturnItemData = ExchangeReturnCancelItemBaseData & {
  /** 주문취소상품 고유번호 */
  id: ReturnItem['id'];
  /** 주문취소상품 개수 */
  amount: ReturnItem['amount'];
  /** 주문취소상품 처리 상태 */
  status: ReturnItem['status'];
};

export type ReturnData = Omit<Return, 'items'> & {
  refund: Refund | null;
  order: { orderCode: Order['orderCode'] };
  items: ReturnItemData[];
};
export type ReturnListRes = {
  list: ReturnData[];
  totalCount: number;
  nextCursor?: number;
};

export type ReturnDetailRes = ReturnData & { images: ReturnImage[] };

export type UpdateReturnRes = boolean;

export type DeleteReturnRes = boolean;
