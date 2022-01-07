import { AdminOrderCancelRequestList } from '@project-lc/components-admin/AdminOrderCancelRequestList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { Heading } from '@chakra-ui/react';

export default function OrderCancelRequest(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>판매자의 결제취소요청</Heading>
      <AdminOrderCancelRequestList />
    </AdminPageLayout>
  );
}
