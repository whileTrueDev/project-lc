import { useEffect } from 'react';
import { Box, Heading, Text, useToast } from '@chakra-ui/react';
import { AdminBusinessRegistrationList } from '@project-lc/components-admin/AdminBusinessRegistrationList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useAdminPrivacyApproachHistoryMutation, useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function SellerBusinessRegistration(): JSX.Element {
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
      mutateAsync({ infoType: 'sellerBusinessRegistration', actionType: 'view' });
    }
  }, []);

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Heading>판매자</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              등록된 사업자 등록 정보
            </Text>
            <AdminBusinessRegistrationList />
          </Box>
        </Box>
      </Box>
    </AdminPageLayout>
  );
}

export default SellerBusinessRegistration;
