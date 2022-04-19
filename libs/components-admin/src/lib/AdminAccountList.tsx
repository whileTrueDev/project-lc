import { GridColumns, GridCellParams } from '@material-ui/data-grid';
import { SellerSettlementAccount } from '@prisma/client';
import { useDisplaySize } from '@project-lc/hooks';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useDisclosure, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { AdminImageDownloadModal } from './AdminImageDownloadModal';

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
  const {
    isOpen: isDownloadOpen,
    onClose: onDownloadClose,
    onOpen: onDownloadOpen,
  } = useDisclosure();
  const { sellerSettlementAccount } = props;
  const [selectedRow, setSelectedRow] = useState({});

  const handleClick = async (param: GridCellParams): Promise<void> => {
    setSelectedRow(param.row);
    onDownloadOpen();
  };

  const columns: GridColumns = [
    {
      field: 'seller.email',
      headerName: '광고주 이메일',
      valueGetter: ({ row }) => row.seller.email,
      minWidth: 230,
    },
    {
      field: 'bank',
      headerName: '은행명',
      minWidth: 230,
    },
    {
      field: 'number',
      headerName: '계좌번호',
      minWidth: 230,
    },
    {
      field: 'name',
      headerName: '예금주',
      minWidth: 230,
    },
    {
      field: 'settlementAccountImageName',
      headerName: '통장사본 이미지',
      renderCell: () => <Button size="xs">다운로드</Button>,
      minWidth: 230,
    },
  ];

  return (
    <>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={makeListRow(sellerSettlementAccount)}
        onCellClick={handleClick}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
      />
      <AdminImageDownloadModal
        isOpen={isDownloadOpen}
        onClose={onDownloadClose}
        type="settlement-account"
        row={selectedRow}
      />
    </>
  );
}
