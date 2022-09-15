import { Heading, Stack } from '@chakra-ui/react';
import { AdminBcSettlementDoneList } from '@project-lc/components-admin/AdminBcSettlementDoneList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import AdminTabAlarmResetButton from '@project-lc/components-admin/AdminTabAlarmResetButton';
import { BcSettlementTargetList } from '@project-lc/components-admin/BcSettlementTargetList';
import {
  useAdminLatestCheckedData,
  useAdminLatestCheckedDataMutation,
} from '@project-lc/hooks';
import { BroadcasterSettlementTargets } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

export function BroadcasterSettlement(): JSX.Element {
  const router = useRouter();
  const { data: adminCheckedData } = useAdminLatestCheckedData();
  const { mutateAsync } = useAdminLatestCheckedDataMutation();

  const queryClient = useQueryClient();
  const onResetButtonClick = async (): Promise<void> => {
    const queryData =
      queryClient.getQueryData<BroadcasterSettlementTargets>('BcSettlementTargets');
    if (!queryData || !queryData[0]) return;
    // 가장 최근 데이터 = id 가장 큰값
    const latestId = queryData[0].id;
    console.log(latestId);

    const dto = { ...adminCheckedData, [router.pathname]: latestId }; // pathname 을 키로 사용
    mutateAsync(dto).catch((e) => console.error(e));
  };

  return (
    <AdminPageLayout>
      <Stack p={6} spacing={4}>
        <Heading as="h3" size="lg">
          방송인 정산 처리
        </Heading>
        {/* 정산 대상 */}
        <Stack direction="row">
          <Heading as="h3" size="lg">
            정산 대상 목록
          </Heading>
          <AdminTabAlarmResetButton onClick={onResetButtonClick} />
        </Stack>

        <BcSettlementTargetList />
      </Stack>

      <Stack mt={12} p={6} spacing={4}>
        <Heading as="h3" size="lg">
          정산 완료 목록
        </Heading>
        <AdminBcSettlementDoneList />
      </Stack>
    </AdminPageLayout>
  );
}

export default BroadcasterSettlement;
