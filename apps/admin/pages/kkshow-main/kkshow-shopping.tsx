import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminKkshowShopping } from '@project-lc/components-admin/kkshow-main/AdminKkshowShopping';
import { AdminKkshowShoppingSectionOrderManage } from '@project-lc/components-admin/kkshow-main/shopping/AdminKkshowShoppingSectionOrderManage';

export function KkshowShopping(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminKkshowShoppingSectionOrderManage />
      {/* <AdminKkshowShopping /> */}
    </AdminPageLayout>
  );
}

export default KkshowShopping;
