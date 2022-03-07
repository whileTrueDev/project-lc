import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import AdminKkshowMain from '@project-lc/components-admin/kkshow-main/AdminKkshowMain';

export function Index(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminKkshowMain />
    </AdminPageLayout>
  );
}

export default Index;
