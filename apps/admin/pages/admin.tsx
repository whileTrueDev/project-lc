import { Box, Text, Flex } from '@chakra-ui/react';
import {
  AdminPageLayout,
  AdminAccountList,
  AdminBusinessRegistrationList,
} from '@project-lc/components';
import { useAdminSettlementInfo } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { data: settlementData } = useAdminSettlementInfo();

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
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
