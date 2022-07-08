import { ExchangeData } from '../res-types/exchange.res';
import { OrderCancellationData } from '../res-types/orderCancellation.res';
import { ReturnData } from '../res-types/return.res';

export type ExchangeReturnCancelType = 'exchange' | 'return' | 'cancel';
export interface ExchangeReturnCancelListItemBase {
  type: ExchangeReturnCancelType;
}
export interface ExchangeListItem extends ExchangeReturnCancelListItemBase {
  type: 'exchange';
  data: ExchangeData;
}
export interface ReturnListItem extends ExchangeReturnCancelListItemBase {
  type: 'return';
  data: ReturnData;
}
export interface CancelListItem extends ExchangeReturnCancelListItemBase {
  type: 'cancel';
  data: OrderCancellationData;
}
