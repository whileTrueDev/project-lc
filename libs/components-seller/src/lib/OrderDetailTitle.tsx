import { Heading, Stack, Text } from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import FmRefundStatusBadge from '@project-lc/components-shared/FmRefundStatusBadge';
import FmReturnStatusBadge from '@project-lc/components-shared/FmReturnStatusBadge';
import { useOrderReturnOrRefundStatus } from '@project-lc/hooks';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';

export interface OrderDetailTitleProps {
  order: FindFmOrderDetailRes;
}
export function OrderDetailTitle({ order }: OrderDetailTitleProps): JSX.Element {
  // 이 주문의 여러 환불 상태 중, 최종 환불 상태 찾기
  const refundStatus = useOrderReturnOrRefundStatus(order.refunds);
  // 이 주문의 여러 반품 상태 중, 최종 환불 상태 찾기
  const returnStatus = useOrderReturnOrRefundStatus(order.returns);

  return (
    <>
      <Heading>주문 {order.id}</Heading>
      <Stack direction="row" alignItems="center">
        <FmOrderStatusBadge orderStatus={order.step} />
        {order.refunds && order.refunds.length > 0 && refundStatus && (
          <FmRefundStatusBadge refundStatus={refundStatus} />
        )}
        {order.returns && order.returns.length > 0 && returnStatus && (
          <FmReturnStatusBadge returnStatus={returnStatus} />
        )}
        <TextDotConnector />
        <Text>{dayjs(order.regist_date).fromNow()}</Text>
      </Stack>
    </>
  );
}

export default OrderDetailTitle;
