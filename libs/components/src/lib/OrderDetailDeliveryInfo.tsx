import { Text, Box, SimpleGrid, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FindFmOrderDetailRes } from '@project-lc/shared-types';

/** 주문 주문자/수령자 등 배송 관련 정보 */
export function OrderDetailDeliveryInfo({ order }: { order: FindFmOrderDetailRes }) {
  // 주문자 전화
  const ordererPhone = useMemo(() => {
    return order.order_phone === '--' ? null : order.order_phone;
  }, [order.order_phone]);
  // 수령자 전화
  const recipientPhone = useMemo(() => {
    return order.recipient_phone === '--' ? null : order.recipient_phone;
  }, [order.recipient_phone]);

  // 지번 주소
  const addressJibun = useMemo(
    () => `${order.recipient_address_street} ${order.recipient_address_detail}`,
    [order.recipient_address_detail, order.recipient_address_street],
  );
  // 도로명주소
  const addressStreet = useMemo(
    () => `${order.recipient_address} ${order.recipient_address_detail}`,
    [order.recipient_address, order.recipient_address_detail],
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">주문자</Text>
        </Box>
        <Text>{order.order_user_name}</Text>
        <Text>{order.order_email}</Text>
        {ordererPhone && <Text>{ordererPhone}</Text>}
        <Text>{order.order_cellphone}</Text>
      </Stack>
      <Stack spacing={1} my={2}>
        <Box mb={2}>
          <Text fontWeight="bold">수령자</Text>
        </Box>
        <Text>{order.recipient_user_name}</Text>
        <Text>(우편번호) {order.recipient_zipcode}</Text>
        <Text>(지번) {addressJibun}</Text>
        <Text>(도로명) {addressStreet}</Text>
        {recipientPhone && <Text>{recipientPhone}</Text>}
        <Text>{order.recipient_cellphone}</Text>
        <Text>{order.recipient_email}</Text>
      </Stack>
    </SimpleGrid>
  );
}
