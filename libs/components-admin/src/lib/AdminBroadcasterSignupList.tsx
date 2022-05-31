import { Heading, Stack, Button, useDisclosure } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { useAdminBroadcasters } from '@project-lc/hooks';
import { adminBroadcasterListStore } from '@project-lc/stores';
import { AdminBroadcasterSignupListDetailDialog } from './AdminBroadcasterSignupListDetailDialog';

export function AdminBroadcasterSignupList(): JSX.Element {
  const { data: broadcasters } = useAdminBroadcasters();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setBroadcasterDetail } = adminBroadcasterListStore();

  const columns: GridColumns = [
    {
      field: 'id',
      headerName: 'id',
      width: 20,
    },
    {
      field: 'email',
      headerName: 'email',
      width: 100,
      flex: 1,
    },
    {
      field: 'userNickname',
      headerName: '닉네임',
      width: 100,
      flex: 1,
    },
    {
      field: 'overlayUrl',
      headerName: '오버레이URL',
      width: 100,
      flex: 1,
    },
    {
      field: 'agreementFlag',
      headerName: '개인정보동의',
      width: 150,
      valueFormatter: ({ row }: GridRowData) => (row.agreementFlag ? '🟢' : '❌'),
    },

    {
      field: '',
      headerName: '상세보기',
      width: 100,
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          상세보기
        </Button>
      ),
    },
  ];

  const handleButtonClick = (value: GridRowData): void => {
    setBroadcasterDetail(value);
    onOpen();
  };

  return (
    <Stack>
      <Heading>가입자 목록</Heading>
      <ChakraDataGrid
        columns={columns}
        rows={broadcasters || []}
        minH={500}
        density="compact"
        disableSelectionOnClick
      />
      <AdminBroadcasterSignupListDetailDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
}

export default AdminBroadcasterSignupList;
