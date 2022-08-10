import { Divider, Heading, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminReturnRequestList } from '@project-lc/components-admin/order/returnRequest/AdminReturnRequestList';
import { AdminReturnRequestFilter } from '@project-lc/components-admin/order/returnRequest/AdminReturnRequestFilter';

export default function OrderRefundIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Stack spacing={4}>
        <Heading size="sm">주문 환불(결제취소)처리하기</Heading>
        <AdminReturnRequestFilter />
        <Divider />
        <AdminReturnRequestList />
      </Stack>
    </AdminPageLayout>
  );
}
