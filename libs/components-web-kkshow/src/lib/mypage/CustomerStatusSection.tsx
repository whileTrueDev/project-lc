import { Stack, Text } from '@chakra-ui/react';
import { useCustomerStatus, useProfile } from '@project-lc/hooks';

export function CustomerStatusSection(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: customerStatus } = useCustomerStatus(profileData?.id);

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      justifyContent={{ base: 'center', md: 'flex-start' }}
      alignItems="center"
      p={{ base: 4, md: 8 }}
      spacing={{ base: 6, md: 10 }}
    >
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <Text fontWeight="bold" fontSize="xl">
          {profileData?.name} 님
        </Text>
        <Text>({profileData?.email})</Text>
      </Stack>
      <Stack
        direction="row"
        width={{ base: '100%', md: 'auto' }}
        spacing={{ base: 0, md: 10 }}
        px={8}
        justifyContent="space-around"
      >
        <StatusBox label="팔로잉" value={customerStatus?.followingBroadcasters} />
        <StatusBox label="라이브알림" value={customerStatus?.followingLiveShoppings} />
        <StatusBox label="배송중" value={customerStatus?.shippingOrders} />
      </Stack>
    </Stack>
  );
}

function StatusBox({ label, value }: { label: string; value?: number }): JSX.Element {
  return (
    <Stack textAlign="center">
      <Text>{label}</Text>
      <Text>{value}</Text>
    </Stack>
  );
}
