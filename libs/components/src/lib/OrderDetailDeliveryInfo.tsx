import { Text, Box, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';

/** 주문 주문자/수령자 등 배송 관련 정보 */
export function OrderDetailDeliveryInfo({
  orderDeliveryData,
}: {
  orderDeliveryData: Pick<
    FindFmOrderDetailRes,
    | 'order_phone'
    | 'recipient_phone'
    | 'recipient_address_street'
    | 'recipient_address_detail'
    | 'recipient_address'
    | 'recipient_address_detail'
    | 'order_user_name'
    | 'order_email'
    | 'order_cellphone'
    | 'recipient_user_name'
    | 'recipient_zipcode'
    | 'recipient_cellphone'
    | 'recipient_email'
    | 'memo'
  >;
}): JSX.Element {
  // 주문자 전화
  const ordererPhone = useMemo(() => {
    return orderDeliveryData.order_phone === '--' ? null : orderDeliveryData.order_phone;
  }, [orderDeliveryData.order_phone]);
  // 수령자 전화
  const recipientPhone = useMemo(() => {
    return orderDeliveryData.recipient_phone === '--'
      ? null
      : orderDeliveryData.recipient_phone;
  }, [orderDeliveryData.recipient_phone]);

  // 지번주소
  const addressJibun = useMemo(() => {
    if (!orderDeliveryData.recipient_address) return '';
    return `${orderDeliveryData.recipient_address} ${orderDeliveryData.recipient_address_detail}`;
  }, [orderDeliveryData.recipient_address_detail, orderDeliveryData.recipient_address]);

  // 도로명주소
  const addressStreet = useMemo(() => {
    if (!orderDeliveryData.recipient_address_street) return '';
    return `${orderDeliveryData.recipient_address_street} ${orderDeliveryData.recipient_address_detail}`;
  }, [
    orderDeliveryData.recipient_address_street,
    orderDeliveryData.recipient_address_detail,
  ]);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">주문자</Text>
        </Box>
        <Text>{orderDeliveryData.order_user_name}</Text>
        <Text>{orderDeliveryData.order_email}</Text>
        {ordererPhone && <Text>{ordererPhone}</Text>}
        <Text>{orderDeliveryData.order_cellphone}</Text>
      </Stack>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">수령자</Text>
        </Box>
        <Text>{orderDeliveryData.recipient_user_name}</Text>
        <Text>(우편번호) {orderDeliveryData.recipient_zipcode}</Text>
        <Text>(지번) {addressJibun}</Text>
        <Text>(도로명) {addressStreet}</Text>
        <Text>(배송메모) {orderDeliveryData.memo}</Text>
        {recipientPhone && <Text>{recipientPhone}</Text>}
        <Text>{orderDeliveryData.recipient_cellphone}</Text>
        <Text>{orderDeliveryData.recipient_email}</Text>
      </Stack>
    </SimpleGrid>
  );
}
