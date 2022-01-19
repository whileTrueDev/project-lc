import { Heading } from '@chakra-ui/react';
import { AdminGoodsList } from '@project-lc/components-admin/AdminGoodsList';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Goods(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>상품목록</Heading>
      <AdminGoodsList />
    </AdminPageLayout>
  );
}

export default Goods;
