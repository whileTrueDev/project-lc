import { Text, Heading, Stack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import {
  FmOrderStatusBadge,
  FmRefundStatusBadge,
  FmReturnStatusBadge,
  TextDotConnector,
} from '..';

dayjs.locale('ko');
dayjs.extend(relativeTime);

export interface OrderDetailTitleProps {
  order: FindFmOrderDetailRes;
}
export function OrderDetailTitle({ order }: OrderDetailTitleProps) {
  return (
    <>
      <Heading>주문 {order.id}</Heading>
      <Stack direction="row" alignItems="center">
        <FmOrderStatusBadge orderStatus={order.step} />
        {order.refunds && <FmRefundStatusBadge refundStatus={order.refunds.status} />}
        {order.returns && <FmReturnStatusBadge returnStatus={order.returns.status} />}
        <TextDotConnector />
        <Text>{dayjs(order.regist_date).fromNow()}</Text>
      </Stack>
    </>
  );
}
