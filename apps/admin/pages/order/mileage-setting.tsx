import { Heading, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminOrderMileageSetting } from '@project-lc/components-admin/mileage-setting/AdminOrderMileageSetting';

export default function OrderMileageSetting(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack spacing={4}>
        <Heading size="sm">마일리지 설정(전역)</Heading>
        <AdminOrderMileageSetting />
      </Stack>
    </AdminPageLayout>
  );
}
