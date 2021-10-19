import { Heading, Stack } from '@chakra-ui/react';
import { AdminPageLayout, SettlementTargetList } from '@project-lc/components';

export function SettlementIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack p={6} spacing={4}>
        <Heading as="h3" size="lg">
          정산 대상 목록
        </Heading>
        <SettlementTargetList />
      </Stack>
    </AdminPageLayout>
  );
}

export default SettlementIndex;
