import { AdminGoodsList } from '@project-lc/components-admin/AdminGoodsList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Goods(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminGoodsList />
    </AdminPageLayout>
  );
}

export default Goods;
