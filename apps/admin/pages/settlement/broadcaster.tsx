import { Heading, Stack } from '@chakra-ui/react';
import {
  AdminBcSettlementDoneList,
  AdminPageLayout,
  BcSettlementTargetList,
} from '@project-lc/components';

export function BroadcasterSettlement(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack p={6} spacing={4}>
        {/* 정산 대상 */}
        <Heading as="h3" size="lg">
          정산 대상 목록
        </Heading>
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
