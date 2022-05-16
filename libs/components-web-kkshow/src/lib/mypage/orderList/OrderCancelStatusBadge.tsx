import { ProcessStatus } from '@prisma/client';
import { ExchangeReturnCancelRequestStatusBadge } from '../exchange-return-cancel/list/ExchangeReturnCancelListItem';

export function OrderCancelStatusBadge({
  status,
}: {
  status: ProcessStatus;
}): JSX.Element {
  return <ExchangeReturnCancelRequestStatusBadge status={status} prefix="주문취소 " />;
}

export default OrderCancelStatusBadge;
