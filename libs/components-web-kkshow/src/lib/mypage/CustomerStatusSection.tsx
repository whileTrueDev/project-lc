import {
  Box,
  Button,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AvatarChangeButton } from '@project-lc/components-shared/AvatarChangeButton';
import { useCustomerInfo, useCustomerStatus, useProfile } from '@project-lc/hooks';
import CustomerNicknameChangeDialog from './info/CustomerNicknameChangeDialog';

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
        <AvatarChangeButton />
        <Box mt={2}>
          <Text fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
            {profileData?.name} 님
          </Text>
          <NicknameBox customerId={profileData?.id} />
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
    <Stat textAlign="center" minW="70px">
      <StatLabel>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
    </Stat>
  );
}

function NicknameBox({ customerId }: { customerId?: number }): JSX.Element | null {
  const { data: customer } = useCustomerInfo(customerId);
  const nicknameDialog = useDisclosure();
  if (!customer) return null;
  return (
    <Box p={2} maxW={280}>
      {customer.nickname ? (
        <Text>{customer?.nickname}</Text>
      ) : (
        <Box>
          <Button
            size="sm"
            variant="link"
            textDecor="underline"
            onClick={nicknameDialog.onOpen}
          >
            닉네임설정
          </Button>
          <CustomerNicknameChangeDialog
            isOpen={nicknameDialog.isOpen}
            onClose={nicknameDialog.onClose}
            onConfirm={nicknameDialog.onClose}
            userId={customer.id}
          />
        </Box>
      )}
    </Box>
  );
}
