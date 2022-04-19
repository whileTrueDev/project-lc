import { Heading } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminCategory } from '@project-lc/components-admin/AdminCategory';

export function GoodsCategory(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>카테고리</Heading>
      <AdminCategory />
    </AdminPageLayout>
  );
}

export default GoodsCategory;
