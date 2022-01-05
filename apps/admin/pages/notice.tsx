import { AdminNoticeSection } from '@project-lc/components-admin/AdminNoticeSection';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Notice(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminNoticeSection />
    </AdminPageLayout>
  );
}

export default Notice;
