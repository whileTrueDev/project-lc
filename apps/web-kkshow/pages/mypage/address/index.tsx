import { Box, Stack, Text } from '@chakra-ui/react';
import { CustomerAddressCreateButton } from '@project-lc/components-web-kkshow/address/CustomerAddressCreateDialog';
import { CustomerAddressList } from '@project-lc/components-web-kkshow/address/CustomerAddressList';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

export function ContactsIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <Box p={{ base: 2, md: 4 }}>
        {/* 제목 */}
        <Text fontSize="xl" fontWeight="bold">
          배송지 관리
        </Text>

        <Stack mt={10} spacing={4} alignItems="flex-start">
          <CustomerAddressCreateButton />
          <CustomerAddressList />
        </Stack>
      </Box>
    </CustomerMypageLayout>
  );
}

export default ContactsIndex;
