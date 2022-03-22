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
import { useDisplaySize, useAdminSettlementInfo } from '@project-lc/hooks';
import { BusinessRegistrationStatus } from '@project-lc/shared-types';
import { useState, ChangeEvent } from 'react';
import { AdminBusinessRegistrationConfirmationDialog } from './AdminBusinessRegistrationConfirmationDialog';
import { AdminBusinessRegistrationRejectionDialog } from './AdminBusinessRegistrationRejectionDialog';
import { AdminImageDownloadButton } from './AdminImageDownloadButton';

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
    renderCell: (params) => (
      <AdminImageDownloadButton row={params.row} type="business-registration" />
    ),
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
    renderCell: (params) => (
      <AdminImageDownloadButton row={params.row} type="mail-order" />
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

// 관리자가 볼 계좌번호 등록 리스트
export function AdminBusinessRegistrationList(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { data: settlementData } = useAdminSettlementInfo();
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

  const handleClick = async (param: GridCellParams): Promise<void> => {
    if (param.field === 'confirmation') {
      setSelectedRow(param.row);
      onConfirmationOpen();
    }
    if (param.field === 'rejection') {
      setSelectedRow(param.row);
      onRejectionOpen();
    }
    // 이외의 클릭에 대해서는 다른 패널에 대해서 상세보기로 이동시키기
  };

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

  return (
    <>
      {settlementData && (
        <>
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
        </>
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
    </>
  );
}
