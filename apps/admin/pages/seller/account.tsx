import { useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { AdminAccountList } from '@project-lc/components-admin/AdminAccountList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import {
  useAdminSettlementInfo,
  useAdminPrivacyApproachHistoryMutation,
} from '@project-lc/hooks';

export function SellerAccountList(): JSX.Element {
  const { data: settlementData } = useAdminSettlementInfo();
  const { mutateAsync } = useAdminPrivacyApproachHistoryMutation();

  useEffect(() => {
    mutateAsync({ infoType: 'sellerSettlementAccount', actionType: 'view' });
  }, []);

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Heading>판매자</Heading>

          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 계좌 정보
            </Text>
            <AdminAccountList
              sellerSettlementAccount={settlementData?.sellerSettlementAccount}
            />
          </Box>
        </Box>
      </Box>
    </AdminPageLayout>
  );
}

export default SellerAccountList;
