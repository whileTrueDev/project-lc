import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import { TaxationType } from '@prisma/client';
import { TAX_TYPE } from '@project-lc/components-constants/taxType';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminBroadcasterSettlementInfoList, useDisplaySize } from '@project-lc/hooks';
import { BroadcasterSettlementInfoListRes } from '@project-lc/shared-types';
import { useState } from 'react';
import AdminBroadcasterSettlementInfoConfirmationDialog from './AdminBroadcasterSettlementInfoConfirmationDialog';
import AdminBroadcasterSettlementInfoRejectionDialog from './AdminBroadcasterSettlementInfoRejectionDialog';
import { ConfirmationBadge, makeListRow } from './AdminBusinessRegistrationList';
import { AdminImageDownloadButton } from './AdminImageDownloadButton';

const columns: GridColumns = [
  {
    field: 'confirmationStatus',
    headerName: '검수상태',
    renderCell: (params) => <ConfirmationBadge status={params.row.confirmation.status} />,
    width: 150,
  },
  {
    field: 'email',
    headerName: '방송인 이메일',
    renderCell: (params) => <Text>{params.row.broadcaster.email}</Text>,
    minWidth: 230,
  },
  {
    field: 'nickname',
    headerName: '활동명',
    renderCell: (params) => <Text>{params.row.broadcaster.userNickname}</Text>,
    minWidth: 150,
  },
  {
    field: 'type',
    headerName: '과세유형',
    renderCell: (params) => <Text>{TAX_TYPE[params.row.type as TaxationType]}</Text>,
    minWidth: 120,
  },
  {
    field: 'name',
    headerName: '이름',
    minWidth: 100,
  },
  {
    field: 'phoneNumber',
    headerName: '핸드폰번호',
    minWidth: 150,
  },
  {
    field: 'idCardNumber',
    headerName: '주민등록번호',
    minWidth: 150,
  },
  {
    field: 'idCardImageName',
    headerName: '주민등록증',
    renderCell: (params) => (
      <AdminImageDownloadButton row={params.row} type="broadcaster-id-card" />
    ),
    minWidth: 150,
  },
  {
    field: 'bank',
    headerName: '은행',
    minWidth: 100,
  },
  {
    field: 'accountHolder',
    headerName: '예금주',
    minWidth: 100,
  },
  {
    field: 'accountNumber',
    headerName: '계좌번호',
    minWidth: 230,
  },
  {
    field: 'accountImageName',
    headerName: '통장사본',
    renderCell: (params) => (
      <AdminImageDownloadButton row={params.row} type="broadcaster-account-image" />
    ),
    minWidth: 150,
  },
  {
    field: 'confirmation',
    headerName: '검수승인',
    width: 100,
    renderCell: () => <Button size="xs">승인하기</Button>,
    sortable: false,
  },
  {
    field: 'rejection',
    headerName: '검수반려',
    width: 100,
    renderCell: () => <Button size="xs">반려하기</Button>,
    sortable: false,
  },
];

export function AdminBroadcasterSettlementInfoList(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { data, isLoading } = useAdminBroadcasterSettlementInfoList();

  const [selectedRow, setSelectedRow] = useState({});
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const {
    isOpen: isRejectionOpen,
    onOpen: onRejectionOpen,
    onClose: onRejectionClose,
  } = useDisclosure();

  async function handleClick(param: GridCellParams): Promise<void> {
    if (param.field === 'confirmation') {
      setSelectedRow(param.row);
      onConfirmationOpen();
    }
    if (param.field === 'rejection') {
      setSelectedRow(param.row);
      onRejectionOpen();
    }
  }
  return (
    <>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={makeListRow<BroadcasterSettlementInfoListRes>(data)}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        onCellClick={handleClick}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
        loading={isLoading}
      />
      <AdminBroadcasterSettlementInfoRejectionDialog
        isOpen={isRejectionOpen}
        onClose={onRejectionClose}
        row={selectedRow}
      />
      <AdminBroadcasterSettlementInfoConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        row={selectedRow}
      />
    </>
  );
}

export default AdminBroadcasterSettlementInfoList;
