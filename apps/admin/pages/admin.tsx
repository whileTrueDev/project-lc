import { Box, Text, Flex } from '@chakra-ui/react';
import { AdminPageLayout, AdminAccountList } from '@project-lc/components';

const sellerAccounts = [
  {
    email: 'dn0208@gmail.com',
    bank: '농협',
    number: '123124123124123',
    name: '박찬우',
  },
];

const sellerBusinessRegistration = [
  {
    email: 'dn0208@gmail.com',
    bank: '농협',
    number: '123124123124123',
    name: '박찬우',
  },
];

export function Index(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          등록된 계좌 정보
        </Text>
        <AdminAccountList sellerAccounts={sellerAccounts} />
      </Box>
      <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
        <Text fontSize="lg" fontWeight="medium" pb={1}>
          등록된 사업자 등록 정보
        </Text>
        <AdminAccountList sellerAccounts={sellerAccounts} />
      </Box>
      <Box h={200} bgColor="blue.200" as="section">
        <Text>some components2</Text>
        {/* 가입한 광고주의 사업자 등록증 등록 내역 */}
      </Box>
    </AdminPageLayout>
  );
}

export default Index;
