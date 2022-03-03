import { Box, Heading, Text, useToast } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminManagerList } from '@project-lc/components-admin/AdminManagerList';

export function AdminManagePage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box>
        <Heading>관리자 계정 관리</Heading>
        <AdminManagerList />
      </Box>
    </AdminPageLayout>
  );
}

export default AdminManagePage;
