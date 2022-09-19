import { Heading, Stack } from '@chakra-ui/react';
import { AdminBcSettlementDoneList } from '@project-lc/components-admin/AdminBcSettlementDoneList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { BcSettlementTargetList } from '@project-lc/components-admin/BcSettlementTargetList';
import { ExternalLiveShoppingBcSettlement } from '@project-lc/components-admin/ExternalLiveShoppingBcSettlement';

export function BroadcasterSettlement(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack p={6} spacing={4}>
        <Heading as="h3" size="lg">
          방송인 정산 처리
        </Heading>

        {/* 외부상품 라이브쇼핑 판매건 정산내역 생성하기 */}
        <ExternalLiveShoppingBcSettlement />

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
