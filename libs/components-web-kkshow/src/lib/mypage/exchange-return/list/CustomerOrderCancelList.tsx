import { Stack, Text } from '@chakra-ui/react';
import { useCustomerOrderCancellationList, useProfile } from '@project-lc/hooks';

export function CustomerOrderCancelList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: orderCancelList } = useCustomerOrderCancellationList({
    customerId: profileData?.id,
  });
  return (
    <Stack>
      <Text>주문취소 요청 목록</Text>
      <Text>{JSON.stringify(orderCancelList)}</Text>
    </Stack>
  );
}

export default CustomerOrderCancelList;
