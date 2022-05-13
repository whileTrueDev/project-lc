import { Stack, Text } from '@chakra-ui/react';
import { useProfile, useCustomerReturnList } from '@project-lc/hooks';

export function CustomerReturnList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: returnList } = useCustomerReturnList({ customerId: profileData?.id });
  return (
    <Stack>
      <Text>환불 요청 목록</Text>
      <Text>{JSON.stringify(returnList)}</Text>
    </Stack>
  );
}

export default CustomerReturnList;
