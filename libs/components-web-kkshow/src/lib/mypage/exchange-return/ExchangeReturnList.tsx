import { Stack, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';

/** 소비자의 재배송/환불 목록 표시 컴포넌트 */
export function ExchangeReturnList(): JSX.Element {
  const { data: profileData } = useProfile();
  return (
    <Stack>
      <Text> 재배송/환불 신청 목록 표시 customerId: {profileData?.id}</Text>
    </Stack>
  );
}

export default ExchangeReturnList;
