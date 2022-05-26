import { Heading, Stack, Text, useDisclosure, Button } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { useAdminSellerList } from '@project-lc/hooks';
import { adminSellerListStore } from '@project-lc/stores';
import { ConfirmationBadge } from './AdminBusinessRegistrationList';
import { AdminSellerSignupListDetailDialog } from './AdminSellerSignupListDetailDialog';

export function AdminSellerSignupList(): JSX.Element {
  const { data: sellers } = useAdminSellerList();
  const { setSellerDetail } = adminSellerListStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      field: 'name',
      headerName: 'name',
      width: 100,
      flex: 1,
    },
    {
      field: 'userNickname',
      headerName: '상점명',
      width: 100,
      flex: 1,
      valueFormatter: ({ row }) => row.sellerShop.shopName,
    },
    {
      field: 'sellerBusinessRegistration',
      headerName: '사업자등록증',
      renderCell: ({ row }: GridRowData) => (
        <ConfirmationBadge
          status={
            row.sellerBusinessRegistration[0].BusinessRegistrationConfirmation.status
          }
        />
      ),
      flex: 1,
    },
    {
      field: 'sellerSettlementAccount',
      headerName: '계좌정보',
      renderCell: ({ row }: GridRowData) =>
        row.sellerSettlementAccount ? (
          <Text>
            {`${row.sellerSettlementAccount[0].bank} - ${row.sellerSettlementAccount[0].number}`}
          </Text>
        ) : (
          '❌'
        ),
      flex: 1,
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
    setSellerDetail(row);
    onOpen();
  };

  return (
    <Stack>
      <Heading>가입자 목록</Heading>
      <ChakraDataGrid
        columns={columns}
        rows={sellers || []}
        density="compact"
        minH={500}
        disableSelectionOnClick
      />
      <AdminSellerSignupListDetailDialog isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
}

export default AdminSellerSignupList;
