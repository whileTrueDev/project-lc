import { Stack, Text } from '@chakra-ui/react';
import { usePaymentByOrderCode } from '@project-lc/hooks';
import { NonMemberOrderDetailRes } from '@project-lc/shared-types';

export interface NonMemberOrderDetailDisplayProps {
  orderData: NonMemberOrderDetailRes;
}
export function NonMemberOrderDetailDisplay({
  orderData,
}: NonMemberOrderDetailDisplayProps): JSX.Element {
  const { data: paymentData } = usePaymentByOrderCode(
    orderData.order.payment?.paymentKey || '',
  );

  return (
    <Stack overflow="hidden">
      <Text>{orderData.order.orderCode}</Text>
      <Text>연락처 정보</Text>
      <Text>주문상품정보</Text>
      <Text>{JSON.stringify(orderData.order.orderItems)}</Text>
      <Text>배송상태</Text>
      <Text>{JSON.stringify(orderData.order.exports)}</Text>

      <Text>결제내역</Text>
      <Text>{JSON.stringify(paymentData)}</Text>
    </Stack>
  );
}

export default NonMemberOrderDetailDisplay;
