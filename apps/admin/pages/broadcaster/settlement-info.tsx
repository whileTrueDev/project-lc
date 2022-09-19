import { Box, Heading, Text } from '@chakra-ui/react';
import AdminBroadcasterSettlementInfoList from '@project-lc/components-admin/AdminBroadcasterSettlementInfoList';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { useCheckAdminClass } from '@project-lc/hooks';

export function SettlementInfo(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'broadcasterSettlementAccount',
    actionType: 'view',
  });

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Heading>방송인</Heading>

          <Box borderWidth="1px" borderRadius="lg" p={7} height="100%">
            <Text fontSize="lg" fontWeight="medium" pb={1}>
              방송인 정산정보 검수
            </Text>
            <AdminBroadcasterSettlementInfoList />
          </Box>
        </Box>
      </Box>
    </AdminPageLayout>
  );
}

export default SettlementInfo;
