import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useRouter } from 'next/router';
import { AdminManualEdit } from '@project-lc/components-admin/manual/AdminManualEdit';

export function AdminManualDetail(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  return (
    <AdminPageLayout>
      <AdminManualEdit id={Number(id)} />
    </AdminPageLayout>
  );
}

export default AdminManualDetail;
