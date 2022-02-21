import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useRouter } from 'next/router';
import { AdminPolicyEdit } from '@project-lc/components-admin/AdminPolicyEdit';

export function EditPolicy(): JSX.Element {
  const router = useRouter();
  const id = Number(router.query.id);
  return (
    <AdminPageLayout>
      <AdminPolicyEdit id={id} />
    </AdminPageLayout>
  );
}

export default EditPolicy;
