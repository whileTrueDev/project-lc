import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { Box, Heading, Text, Stack } from '@chakra-ui/react';
import AdminBroadcasterSettlementInfoList from '@project-lc/components-admin/AdminBroadcasterSettlementInfoList';
import {
  useAdminLatestCheckedData,
  useAdminLatestCheckedDataMutation,
  useCheckAdminClass,
} from '@project-lc/hooks';
import { AdminTabAlarmResetButton } from '@project-lc/components-admin/AdminTabAlarmResetButton';
import { useQueryClient } from 'react-query';
import { AdminBroadcasterSettlementInfoList as AdminBroadcasterSettlementInfoListType } from '@project-lc/shared-types';
import { useRouter } from 'next/router';

export function SettlementInfo(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'broadcasterSettlementAccount',
    actionType: 'view',
  });

  const router = useRouter();
  const { data: adminCheckedData } = useAdminLatestCheckedData();
  const { mutateAsync } = useAdminLatestCheckedDataMutation();

  const queryClient = useQueryClient();
  const onResetButtonClick = async (): Promise<void> => {
    const queryData = queryClient.getQueryData<AdminBroadcasterSettlementInfoListType>(
      'AdminBroadcasterSettlementInfoList',
    );
    if (!queryData || !queryData[0]) return;
    // 가장 최근 데이터 = id 가장 큰값
    const latestId = queryData[0].id;

    const dto = { ...adminCheckedData, [router.pathname]: latestId }; // pathname 을 키로 사용
    mutateAsync(dto).catch((e) => console.error(e));
  };

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
          <Stack direction="row">
            <Heading>방송인</Heading>
            <AdminTabAlarmResetButton onClick={onResetButtonClick} />
          </Stack>

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
