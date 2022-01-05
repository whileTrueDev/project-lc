import { Heading, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminSettlementDoneList } from '@project-lc/components-admin/AdminSettlementDoneList';
import { SettlementSellCommissionInfo } from '@project-lc/components-admin/SettlementSellCommissionInfo';
import { SettlementTargetList } from '@project-lc/components-admin/SettlementTargetList';

export function SettlementIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack p={6} spacing={4}>
        <Heading as="h3" size="lg">
          판매자 정산 처리
        </Heading>
        {/* 기본판매수수료율 */}
        <SettlementSellCommissionInfo />

        {/* 정산 대상 */}
        <Heading as="h3" size="lg">
          정산 대상 목록
        </Heading>
        <SettlementTargetList />
      </Stack>

      <Stack mt={12} p={6} spacing={4}>
        <Heading as="h3" size="lg">
          정산 완료 목록
        </Heading>

        <AdminSettlementDoneList />
      </Stack>
    </AdminPageLayout>
  );
}

export default SettlementIndex;
