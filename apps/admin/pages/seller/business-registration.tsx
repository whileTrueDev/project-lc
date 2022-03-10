import { Box, Heading, Text } from '@chakra-ui/react';
import { AdminBusinessRegistrationList } from '@project-lc/components-admin/AdminBusinessRegistrationList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useCheckAdminClass } from '@project-lc/hooks';

export function SellerBusinessRegistration(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'sellerBusinessRegistration',
    actionType: 'view',
  });

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
