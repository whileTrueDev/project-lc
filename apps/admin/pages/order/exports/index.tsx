import { Box, Heading } from '@chakra-ui/react';
import { AdminOrderExportList } from '@project-lc/components-admin/AdminOrderExportList';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';

export function ExportsIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box>
        <Heading>출고목록</Heading>
        <AdminOrderExportList />
      </Box>
    </AdminPageLayout>
  );
}

export default ExportsIndex;
