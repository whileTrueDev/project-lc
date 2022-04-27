import { Stack, Text } from '@chakra-ui/react';
import { useCustomerStatus, useProfile } from '@project-lc/hooks';

export function CustomerStatusSection(): JSX.Element {
  const { data: profileData, isLoading } = useProfile();
  const { data: customerStatus } = useCustomerStatus(profileData?.id);

  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Stack direction="row">
        <Text>
          {profileData?.email} ({customerStatus?.nickname})
        </Text>
      </Stack>
      <Stack direction="row">
        <Stack>
          <Text>팔로잉</Text>
          <Text>{customerStatus?.followingBroadcasters}</Text>
        </Stack>
        <Stack>
          <Text>라이브알림</Text>
          <Text>{customerStatus?.followingLiveShoppings}</Text>
        </Stack>
        <Stack>
          <Text>배송중</Text>
          <Text>{customerStatus?.shippingOrders}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
