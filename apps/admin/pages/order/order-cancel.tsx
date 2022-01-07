import { AdminOrderCancelRequestList } from '@project-lc/components-admin/AdminOrderCancelRequestList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { Text } from '@chakra-ui/react';

export default function OrderCancelRequest(): JSX.Element {
  return (
    <AdminPageLayout>
      <Text>판매자의 결제취소요청</Text>
      <AdminOrderCancelRequestList />
    </AdminPageLayout>
  );
}
