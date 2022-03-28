import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

import {
  AdminManualListSection,
  AdminManualListHeader,
} from '@project-lc/components-admin/manual/AdminManualListSection';

export function AdminManualIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminManualListHeader />
      <AdminManualListSection />
    </AdminPageLayout>
  );
}

export default AdminManualIndex;
