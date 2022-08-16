import { Button, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminCustomer } from '@project-lc/hooks';
import { adminCustomerListStore } from '@project-lc/stores';
import { AdminCustomerSignupListDetailDialog } from './AdminCustomerSignupListDetailDialog';

export function AdminCustomerSignupList(): JSX.Element {
  const { data: customers } = useAdminCustomer({
    orderBy: 'desc',
    orderByColumn: 'createDate',
    includeModels: ['addresses', 'coupons', 'goodsReview', 'mileage'],
    take: 99999,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setCustomerDetail } = adminCustomerListStore();
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
      field: 'nickname',
      headerName: '닉네임',
      width: 100,
      flex: 1,
    },
    {
      field: 'name',
      headerName: '이름',
      width: 100,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: '휴대전화',
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
      field: 'detail',
      headerName: '상세보기',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          상세보기
        </Button>
      ),
    },
  ];

  const handleButtonClick = (row: GridRowData): void => {
    setCustomerDetail(row);
    onOpen();
  };
  return (
    <Stack>
      <Heading>가입자 목록</Heading>
      <ChakraDataGrid
        columns={columns}
        rows={customers || []}
        minH={500}
        density="compact"
        disableSelectionOnClick
      />
      <AdminCustomerSignupListDetailDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
}

export default AdminCustomerSignupList;
