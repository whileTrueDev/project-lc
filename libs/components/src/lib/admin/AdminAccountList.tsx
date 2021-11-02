import { GridColumns } from '@material-ui/data-grid';
import { SellerSettlementAccount } from '@prisma/client';
import { useDisplaySize } from '@project-lc/hooks';
import { ChakraDataGrid } from '../ChakraDataGrid';
import { AdminImageDownloadButton } from './AdminImageDownloadButton';

const columns: GridColumns = [
  {
    field: 'sellerEmail',
    headerName: '광고주 이메일',
  },
  {
    field: 'bank',
    headerName: '은행명',
  },
  {
    field: 'number',
    headerName: '계좌번호',
  },
  {
    field: 'name',
    headerName: '예금주',
  },
  {
    field: 'settlementAccountImageName',
    headerName: '통장사본 이미지',
    renderCell: (params) => (
      <AdminImageDownloadButton row={params.row} type="settlement-account" />
    ),
  },
];

function makeListRow(
  sellerSettlementAccount: SellerSettlementAccount[] | undefined,
): SellerSettlementAccount[] {
  if (!sellerSettlementAccount) {
    return [];
  }
  return sellerSettlementAccount.map((element, index: number) => {
    return { ...element, id: index, isRowSelectable: false };
  });
}

// 관리자가 볼 계좌번호 등록 리스트
export function AdminAccountList(props: {
  sellerSettlementAccount: SellerSettlementAccount[];
}): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { sellerSettlementAccount } = props;

  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={makeListRow(sellerSettlementAccount)}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
