import { Heading, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export default function OrderMileageSetting(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack spacing={4}>
        <Heading size="sm">마일리지 설정(전역)</Heading>
      </Stack>
    </AdminPageLayout>
  );
}
