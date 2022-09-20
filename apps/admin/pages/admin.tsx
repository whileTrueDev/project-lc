import { AdminMainSummary } from '@project-lc/components-admin/AdminMainSummary';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Index(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminMainSummary />
    </AdminPageLayout>
  );
}

export default Index;
