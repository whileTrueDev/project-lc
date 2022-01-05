import { AdminOrderCancelRequestList } from '@project-lc/components-admin/AdminOrderCancelRequestList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export default function LiveShopping(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminOrderCancelRequestList />
    </AdminPageLayout>
  );
}
