import { Heading, Box } from '@chakra-ui/react';
import { AdminOrderList } from '@project-lc/components-admin/AdminOrderList';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';

export function OrderIndexPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box>
        <Heading>주문목록</Heading>
        <AdminOrderList />
      </Box>
    </AdminPageLayout>
  );
}

export default OrderIndexPage;
