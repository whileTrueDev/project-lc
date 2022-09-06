import { Heading, Stack, Text } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { ExchangeReturnCancelRequestStatusBadge } from '@project-lc/components-shared/order/ExchangeReturnCancelRequestStatusBadge';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import ProcessStatusBadge from '@project-lc/components-shared/ProcessStatusBadge';
import { OrderDetailRes } from '@project-lc/shared-types';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

export interface OrderDetailTitleProps {
  order: OrderDetailRes;
}
export function OrderDetailTitle({ order }: OrderDetailTitleProps): JSX.Element {
  // 이 주문의 여러 반품 상태 중, 최종 환불 상태 찾기
  const returnStatus = useMemo(() => {
    if (order.returns) {
      const returnStatusList = order.returns.map((r) => r.status);
      if (returnStatusList.includes('complete')) return 'complete';
      if (returnStatusList.includes('canceled')) return 'canceled';
      if (returnStatusList.includes('processing')) return 'processing';
      if (returnStatusList.includes('requested')) return 'requested';
    }
    return null;
  }, [order.returns]);

  const orderItemOptionSteps = useMemo(() => getOrderItemOptionSteps(order), [order]);

  return (
    <>
      <Heading>주문 {order.orderCode}</Heading>
      <Stack direction="row" alignItems="center">
        {orderItemOptionSteps.map((oios) => (
          <OrderStatusBadge key={oios} step={oios} />
        ))}
        {/* 환불이 완료된 후 환불 데이터가 생성되므로 환불상태는 항상 완료로 고정 */}
        {order.refunds && order.refunds.length > 0 && (
          <ProcessStatusBadge processStatus="complete" />
        )}
        {order.returns && order.returns.length > 0 && returnStatus && (
          <>
            <ExchangeReturnCancelRequestStatusBadge status={returnStatus} prefix="반품" />
          </>
        )}
        <TextDotConnector />
        <Text>{dayjs(order.createDate).fromNow()}</Text>
      </Stack>
    </>
  );
}

export default OrderDetailTitle;
