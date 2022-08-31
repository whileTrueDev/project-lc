import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AddOverlayThemeSection } from '@project-lc/components-admin/overlay-theme/AddOverlayThemeSection';

export function AdminOverlayThemeAddPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <AddOverlayThemeSection />
      {/* 목록 */}
    </AdminPageLayout>
  );
}

export default AdminOverlayThemeAddPage;
