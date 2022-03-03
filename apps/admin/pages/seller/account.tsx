import { useEffect } from 'react';
import { Box, Heading, Text, useToast } from '@chakra-ui/react';
import { AdminAccountList } from '@project-lc/components-admin/AdminAccountList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import {
  useAdminSettlementInfo,
  useAdminPrivacyApproachHistoryMutation,
  useProfile,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function SellerAccountList(): JSX.Element {
  const { data: settlementData } = useAdminSettlementInfo();
  const { mutateAsync } = useAdminPrivacyApproachHistoryMutation();
  const { data: profile, isLoading } = useProfile();
  const router = useRouter();
  const toast = useToast();

  if (!isLoading && !['super', 'full'].includes(profile.adminClass)) {
    toast({
      title: '권한없는 계정',
      status: 'error',
    });
    router.push('/admin');
  }

  useEffect(() => {
    if (!isLoading && ['super', 'full'].includes(profile.adminClass)) {
      mutateAsync({ infoType: 'sellerSettlementAccount', actionType: 'view' });
    }
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
