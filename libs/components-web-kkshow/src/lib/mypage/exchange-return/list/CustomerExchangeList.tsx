import { Stack, Text } from '@chakra-ui/react';
import { useCustomerExchangeList, useProfile } from '@project-lc/hooks';

export function CustomerExchangeList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: exchangeList } = useCustomerExchangeList({ customerId: profileData?.id });
  return (
    <Stack>
      <Text>재배송 요청 목록</Text>
      <Text>{JSON.stringify(exchangeList)}</Text>
    </Stack>
  );
}

export default CustomerExchangeList;
