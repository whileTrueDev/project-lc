import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import { TaxationType } from '@prisma/client';
import { TAX_TYPE } from '@project-lc/components-constants/taxType';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  useAdminBroadcasterSettlementInfoList,
  useAdminLatestCheckedData,
  useAdminLatestCheckedDataMutation,
  useDisplaySize,
} from '@project-lc/hooks';
import { BroadcasterSettlementInfoListRes } from '@project-lc/shared-types';
import { s3KeyType } from '@project-lc/utils-s3';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminBroadcasterSettlementInfoConfirmationDialog from './AdminBroadcasterSettlementInfoConfirmationDialog';
import AdminBroadcasterSettlementInfoRejectionDialog from './AdminBroadcasterSettlementInfoRejectionDialog';
import { ConfirmationBadge, makeListRow } from './AdminBusinessRegistrationList';
import AdminDatagridWrapper, {
  NOT_CHECKED_BY_ADMIN_CLASS_NAME,
  useLatestCheckedDataId,
} from './AdminDatagridWrapper';
import { AdminImageDownloadModal } from './AdminImageDownloadModal';
import AdminTabAlarmResetButton from './AdminTabAlarmResetButton';

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
    renderCell: () => <Button size="xs">다운로드</Button>,
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
    renderCell: () => <Button size="xs">다운로드</Button>,
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

  const latestCheckedDataId = useLatestCheckedDataId();

  const [selectedRow, setSelectedRow] = useState({});
  const [selectedType, setSelectedType] = useState<s3KeyType>('broadcaster-id-card');

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

  const {
    isOpen: isDownloadOpen,
    onClose: onDownloadClose,
    onOpen: onDownloadOpen,
  } = useDisclosure();

  const handleClick = async (param: GridCellParams): Promise<void> => {
    if (param.field === 'confirmation') {
      setSelectedRow(param.row);
      onConfirmationOpen();
    }
    if (param.field === 'rejection') {
      setSelectedRow(param.row);
      onRejectionOpen();
    }
    if (param.field === 'idCardImageName') {
      setSelectedRow(param.row);
      setSelectedType('broadcaster-id-card');
      onDownloadOpen();
    }
    if (param.field === 'accountImageName') {
      setSelectedRow(param.row);
      setSelectedType('broadcaster-account-image');
      onDownloadOpen();
    }
  };

  // 알림초기화 핸들러
  const router = useRouter();
  const { data: adminCheckedData } = useAdminLatestCheckedData();
  const { mutateAsync: adminCheckMutation } = useAdminLatestCheckedDataMutation();

  const onResetButtonClick = async (): Promise<void> => {
    if (!data || !data[0]) return;
    // 가장 최근 데이터 = id 가장 큰값
    const latestId = data[0].id;

    const dto = { ...adminCheckedData, [router.pathname]: latestId }; // pathname 을 키로 사용
    adminCheckMutation(dto).catch((e) => console.error(e));
  };

  return (
    <AdminDatagridWrapper>
      <AdminTabAlarmResetButton onClick={onResetButtonClick} />
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={makeListRow<BroadcasterSettlementInfoListRes>(data)}
        getRowClassName={(params) => {
          if (params.row.id > latestCheckedDataId) {
            return NOT_CHECKED_BY_ADMIN_CLASS_NAME;
          }
          return '';
        }}
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
      <AdminImageDownloadModal
        isOpen={isDownloadOpen}
        onClose={onDownloadClose}
        type={selectedType}
        row={selectedRow}
      />
    </AdminDatagridWrapper>
  );
}

export default AdminBroadcasterSettlementInfoList;
