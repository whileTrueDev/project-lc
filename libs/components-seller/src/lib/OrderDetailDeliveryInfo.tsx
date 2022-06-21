import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { OrderDetailRes } from '@project-lc/shared-types';
import { useMemo } from 'react';

/** 주문 주문자/수령자 등 배송 관련 정보 */
export function OrderDetailDeliveryInfo({
  orderDeliveryData,
}: {
  orderDeliveryData: Pick<
    OrderDetailRes,
    | 'ordererPhone'
    | 'recipientAddress'
    | 'recipientDetailAddress'
    | 'ordererName'
    | 'ordererEmail'
    | 'ordererPhone'
    | 'recipientName'
    | 'recipientAddress'
    | 'recipientPostalCode'
    | 'recipientPhone'
    | 'recipientEmail'
    | 'memo'
  >;
}): JSX.Element {
  // 주문자 전화
  const ordererPhone = useMemo(() => {
    return orderDeliveryData.ordererPhone === '--'
      ? null
      : orderDeliveryData.ordererPhone;
  }, [orderDeliveryData.ordererPhone]);
  // 수령자 전화
  const recipientPhone = useMemo(() => {
    return orderDeliveryData.recipientPhone === '--'
      ? null
      : orderDeliveryData.recipientPhone;
  }, [orderDeliveryData.recipientPhone]);

  // 지번주소
  const address = useMemo(() => {
    if (!orderDeliveryData.recipientAddress) return '';
    return `${orderDeliveryData.recipientAddress} ${orderDeliveryData.recipientDetailAddress}`;
  }, [orderDeliveryData.recipientDetailAddress, orderDeliveryData.recipientAddress]);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">주문자</Text>
        </Box>
        <Text>{orderDeliveryData.ordererName}</Text>
        <Text>{orderDeliveryData.ordererEmail}</Text>
        {ordererPhone && <Text>{ordererPhone}</Text>}
      </Stack>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">수령자</Text>
        </Box>
        <Text>{orderDeliveryData.recipientName}</Text>
        <Text>(우편번호) {orderDeliveryData.recipientPostalCode}</Text>
        <Text>(지번) {address}</Text>
        <Text>(배송메모) {orderDeliveryData.memo}</Text>
        {recipientPhone && <Text>{recipientPhone}</Text>}
        <Text>{orderDeliveryData.recipientEmail}</Text>
      </Stack>
    </SimpleGrid>
  );
}

export default OrderDetailDeliveryInfo;
