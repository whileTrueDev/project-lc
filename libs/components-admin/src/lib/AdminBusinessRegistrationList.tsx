import { Badge, Button, useDisclosure, Box, Select } from '@chakra-ui/react';
import {
  GridCellParams,
  GridColumns,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridFilterInputValueProps,
  GridFilterModel,
  getGridStringOperators,
} from '@material-ui/data-grid';
import { SellerBusinessRegistration } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  useDisplaySize,
  useAdminSettlementInfo,
  useAdminLatestCheckedData,
  useAdminLatestCheckedDataMutation,
} from '@project-lc/hooks';
import { BusinessRegistrationStatus } from '@project-lc/shared-types';
import { useState, ChangeEvent } from 'react';
import { s3KeyType } from '@project-lc/utils-s3';
import { useRouter } from 'next/router';
import { AdminBusinessRegistrationConfirmationDialog } from './AdminBusinessRegistrationConfirmationDialog';
import { AdminBusinessRegistrationRejectionDialog } from './AdminBusinessRegistrationRejectionDialog';
import { AdminImageDownloadModal } from './AdminImageDownloadModal';
import AdminDatagridWrapper, {
  NOT_CHECKED_BY_ADMIN_CLASS_NAME,
  useLatestCheckedDataId,
} from './AdminDatagridWrapper';
import AdminTabAlarmResetButton from './AdminTabAlarmResetButton';

const columns: GridColumns = [
  {
    field: 'businessRegistrationStatus',
    headerName: '검수상태',
    valueGetter: (params) => params.row.BusinessRegistrationConfirmation.status,
    renderCell: (params) => (
      <ConfirmationBadge status={params.row.BusinessRegistrationConfirmation.status} />
    ),
    minWidth: 120,
  },
  {
    field: 'companyName',
    headerName: '회사명',
  },
  {
    field: 'seller.email',
    headerName: '광고주 이메일',
    minWidth: 230,
    valueGetter: ({ row }) => row.seller.email,
  },
  {
    field: 'businessRegistrationNumber',
    headerName: '사업자 등록 번호',
    minWidth: 230,
  },
  {
    field: 'representativeName',
    headerName: '대표자명',
  },
  {
    field: 'businessType',
    headerName: '업태',
  },
  {
    field: 'businessItem',
    headerName: '종목',
  },
  {
    field: 'businessAddress',
    headerName: '사업장 주소',
    minWidth: 300,
  },
  {
    field: 'taxInvoiceMail',
    headerName: '계산서 발급 이메일',
    minWidth: 230,
  },
  {
    field: 'businessRegistrationImageName',
    headerName: '사업자등록증',
    renderCell: () => <Button size="xs">다운로드</Button>,
    minWidth: 150,
  },
  {
    field: 'mailOrderSalesNumber',
    headerName: '통신판매업등록번호',
    minWidth: 230,
  },
  {
    field: 'mailOrderSalesImageName',
    headerName: '통신판매업등록증',
    renderCell: ({ row }) => (
      <Button size="xs" disabled={!row.mailOrderSalesImageName}>
        다운로드
      </Button>
    ),
    minWidth: 160,
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

export function makeListRow<T>(list: T[] | undefined): T[] {
  if (!list) {
    return [];
  }
  return list.map((element) => {
    return { ...element, isRowSelectable: false };
  });
}

// 사업자 등록 검수 상태 badge
export function ConfirmationBadge({ status }: { status: string }): JSX.Element {
  let result = null;
  switch (status) {
    case BusinessRegistrationStatus.CONFIRMED: {
      result = { color: 'green', text: '승인됨' };
      break;
    }
    case BusinessRegistrationStatus.REJECTED: {
      result = { color: 'red', text: '반려됨' };
      break;
    }
    case BusinessRegistrationStatus.WAITING: {
      result = { color: 'yellow', text: '대기중' };
      break;
    }
    default: {
      result = { color: 'red', text: '등록안됨' };
    }
  }
  return (
    <Badge colorScheme={result.color} fontSize="sm" size="sm">
      {result.text}
    </Badge>
  );
}

function CustomToolbar(): JSX.Element {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function RegistrationStatusValue(props: GridFilterInputValueProps): JSX.Element {
  const { item, applyValue } = props;

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <Box mt={2}>
      <Select onChange={handleFilterChange} value={item.value}>
        <option value="">전체</option>
        <option value="confirmed">승인됨</option>
        <option value="rejected">반려됨</option>
        <option value="waiting">대기중</option>
      </Select>
    </Box>
  );
}

// 관리자가 볼 계좌번호 등록 리스트
export function AdminBusinessRegistrationList(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { data: settlementData } = useAdminSettlementInfo();
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedType, setSelectedType] = useState<s3KeyType>('business-registration');
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
    if (param.field === 'businessRegistrationImageName') {
      setSelectedRow(param.row);
      setSelectedType('business-registration');
      onDownloadOpen();
    }
    if (param.field === 'mailOrderSalesImageName') {
      setSelectedRow(param.row);
      setSelectedType('mail-order');
      onDownloadOpen();
    }
    // 이외의 클릭에 대해서는 다른 패널에 대해서 상세보기로 이동시키기
  };

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  if (columns.length > 0) {
    const statusColumn = columns.find(
      (column) => column.field === 'businessRegistrationStatus',
    );
    const statusColIndex = columns.findIndex(
      (col) => col.field === 'businessRegistrationStatus',
    );

    const statusFilterOperators = getGridStringOperators().map((operator) => ({
      ...operator,
      InputComponent: RegistrationStatusValue,
    }));
    columns[statusColIndex] = {
      ...statusColumn,
      field: 'businessRegistrationStatus',
      filterOperators: statusFilterOperators,
    };
  }

  const latestCheckedDataId = useLatestCheckedDataId();

  const router = useRouter();
  const { data: adminCheckedData } = useAdminLatestCheckedData();
  const { mutateAsync: adminCheckMutation } = useAdminLatestCheckedDataMutation();

  const onResetButtonClick = async (): Promise<void> => {
    if (
      !settlementData ||
      !settlementData.sellerBusinessRegistration ||
      !settlementData.sellerBusinessRegistration[0]
    )
      return;
    // 가장 최근 데이터 = id 가장 큰값
    const latestId = settlementData.sellerBusinessRegistration[0].id;

    const dto = { ...adminCheckedData, [router.pathname]: latestId }; // pathname 을 키로 사용
    adminCheckMutation(dto).catch((e) => console.error(e));
  };

  return (
    <>
      {settlementData && (
        <AdminDatagridWrapper>
          <AdminTabAlarmResetButton onClick={onResetButtonClick} />
          <ChakraDataGrid
            borderWidth={0}
            hideFooter
            headerHeight={50}
            minH={300}
            density="compact"
            columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
            rows={makeListRow<SellerBusinessRegistration>(
              settlementData.sellerBusinessRegistration,
            )}
            getRowClassName={(params) => {
              if (params.row.id > latestCheckedDataId) {
                return NOT_CHECKED_BY_ADMIN_CLASS_NAME;
              }
              return '';
            }}
            components={{
              Toolbar: CustomToolbar,
            }}
            filterModel={filterModel}
            onFilterModelChange={(model) => setFilterModel(model)}
            rowCount={5}
            rowsPerPageOptions={[25, 50]}
            onCellClick={handleClick}
            disableSelectionOnClick
            disableColumnMenu
          />
        </AdminDatagridWrapper>
      )}
      <AdminBusinessRegistrationRejectionDialog
        isOpen={isRejectionOpen}
        onClose={onRejectionClose}
        row={selectedRow}
      />
      <AdminBusinessRegistrationConfirmationDialog
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
    </>
  );
}
