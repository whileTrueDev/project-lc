import { Box, Text, Button } from '@chakra-ui/react';
import {
  AdminPageLayout,
  AdminAccountList,
  AdminBusinessRegistrationList,
} from '@project-lc/components';
import { useAdminSettlementInfo } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function Index(): JSX.Element {
  const router = useRouter();
  const { data: settlementData } = useAdminSettlementInfo();

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Box px={7} py={4} textAlign="right">
            <Button
              onClick={() => {
                router.push('/settlement');
              }}
              colorScheme="blue"
            >
              정산진행하러가기
            </Button>
          </Box>

          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 계좌 정보
            </Text>
            <AdminAccountList
              sellerSettlementAccount={settlementData?.sellerSettlementAccount}
            />
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 사업자 등록 정보
            </Text>
            <AdminBusinessRegistrationList
              sellerBusinessRegistrations={settlementData?.sellerBusinessRegistration}
            />
          </Box>
        </Box>
      </Box>
    </AdminPageLayout>
  );
}

export default Index;
