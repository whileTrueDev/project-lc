import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminKkshowBcList } from '@project-lc/components-admin/kkshow-main/AdminKkshowBcList';
import { KkshowBcListCreateDialog } from '@project-lc/components-admin/kkshow-main/AdminKkshowBcListForm';

export function KkshowBcListPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Text fontWeight="bold" fontSize="lg">
        크크쇼 방송인 목록 관리
      </Text>
      <KkshowBcListManage />
    </AdminPageLayout>
  );
}

export default KkshowBcListPage;

function KkshowBcListManage(): JSX.Element | null {
  const createDialog = useDisclosure();
  return (
    <Stack spacing={1} justify="start" align="start">
      <Box my={2}>
        <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={createDialog.onOpen}>
          새 방송인 등록
        </Button>
        <KkshowBcListCreateDialog
          isOpen={createDialog.isOpen}
          onClose={createDialog.onClose}
        />
      </Box>
      <AdminKkshowBcList />
    </Stack>
  );
}
