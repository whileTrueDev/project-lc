import {
  Avatar,
  Box,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCustomerStatus, useProfile } from '@project-lc/hooks';

interface CustomerStatusSectionProps {
  mobileVisibility?: boolean;
}
export function CustomerStatusSection({
  mobileVisibility = false,
}: CustomerStatusSectionProps): JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const { data: profileData } = useProfile();
  const { data: customerStatus } = useCustomerStatus(profileData?.id);

  return (
    <Stack
      maxW="5xl"
      m="auto"
      mb={2}
      w="100%"
      bgColor={bgColor}
      rounded="md"
      direction={{ base: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      p={4}
      spacing={{ base: 6, md: 10 }}
      display={{ base: mobileVisibility ? 'flex' : 'none', md: 'flex' }}
    >
      <Box textAlign="center">
        <Avatar src={profileData?.avatar || ''} size="lg" />
        <Box mt={2}>
          <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
            {profileData?.name} 님
          </Text>
          <Text>({profileData?.email})</Text>
        </Box>
      </Box>

      <Stack direction="row" spacing={{ base: 4, md: 10 }} justifyContent="space-between">
        <StatusBox label="팔로잉" value={customerStatus?.followingBroadcasters} />
        <StatusBox label="라이브알림" value={customerStatus?.followingLiveShoppings} />
        <StatusBox label="배송중" value={customerStatus?.shippingOrders} />
      </Stack>
    </Stack>
  );
}

function StatusBox({ label, value }: { label: string; value?: number }): JSX.Element {
  return (
    <Stat textAlign="center" minW="60px">
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
    </Stat>
  );
}
