import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Button,
  useBoolean,
  Collapse,
} from '@chakra-ui/react';
import {
  DataGridProps,
  GridColumns,
  GridRowData,
  GridRowParams,
} from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminReturnList } from '@project-lc/hooks';
import { AdminReturnData, AdminReturnRes } from '@project-lc/shared-types';
import { useAdminReturnFilterStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import AdminReturnRequestDetail from './AdminReturnRequestDetail';

/** 판매자에 의해 승인된 소비자의 환불요청 목록
 * 해당 요청, 주문 내용 확인 가능 */
export function AdminReturnRequestList(): JSX.Element {
  const dialog = useDisclosure();
  const filterStore = useAdminReturnFilterStore();
  const { data, isLoading } = useAdminReturnList({
    searchDateType: filterStore.searchDateType,
    searchStartDate: filterStore.searchStartDate,
    searchEndDate: filterStore.searchEndDate,
  });

  const [selectedRequest, setSelectedRequest] = useState<AdminReturnData | null>(null);

  const handleRowClick = (param: GridRowParams): void => {
    setSelectedRequest(param.row as AdminReturnData);
    dialog.onOpen();
  };

  const handleClose = (): void => {
    dialog.onClose();
    setSelectedRequest(null);
  };

  const {
    notConfirmed,
    confirmed,
    finished,
  }: {
    notConfirmed: AdminReturnRes;
    confirmed: AdminReturnRes;
    finished: AdminReturnRes;
  } = useMemo(() => {
    if (!data) {
      return { notConfirmed: [], confirmed: [], finished: [] };
    }
    return {
      // 요청됨, 거절됨 목록
      notConfirmed: data.filter((d) => ['requested', 'canceled'].includes(d.status)),
      // 처리중(승인됨) 목록
      confirmed: data.filter((d) => d.status === 'processing'),
      // 환불처리 완료됨(관리자가 환불처리 함) 목록
      finished: data.filter((d) => d.status === 'complete'),
    };
  }, [data]);

  if (isLoading) return <Spinner />;
  if (!data) return <Text>환불요청이 없습니다</Text>;
  return (
    <Stack spacing={10}>
      {/* 미승인 목록(요청됨, 거절됨) */}
      <AdminReturnListComponent
        title={
          <Text fontWeight="bold" fontSize="lg" color="blue">
            판매자가 승인하지 않은 환불요청 목록(요청됨, 거절됨)
          </Text>
        }
        rows={notConfirmed}
        onRowClick={handleRowClick}
      />

      {/* 승인됨 */}
      <AdminReturnListComponent
        title={
          <Text fontWeight="bold" fontSize="lg" color="red">
            관리자가 환불처리 해야 할 환불요청 목록(판매자 혹은 관리자에 의해 승인됨)
          </Text>
        }
        rows={confirmed}
        onRowClick={handleRowClick}
      />

      {/* 완료됨(환불완료) */}
      <AdminReturnListComponent
        title="완료됨(관리자가 환불 처리 완료)"
        rows={finished}
        onRowClick={handleRowClick}
      />

      <Modal isOpen={dialog.isOpen} onClose={handleClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>환불처리</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AdminReturnRequestDetail
              data={selectedRequest}
              onSubmit={handleClose}
              onCancel={handleClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default AdminReturnRequestList;

const columns: GridColumns = [
  {
    field: 'returnCode',
    headerName: '환불(반품)요청코드',
    minWidth: 200,
  },
  {
    field: 'ordreCode',
    headerName: '주문코드',
    minWidth: 200,
    valueGetter: (params) => {
      return params.row.order.orderCode;
    },
  },
  {
    field: 'ordrerName',
    headerName: '주문자명',
    minWidth: 120,
    valueGetter: (params) => {
      return params.row.order.ordererName;
    },
  },
  {
    field: 'status',
    headerName: '요청처리상태',
    minWidth: 200,
    valueGetter: (params) => {
      switch (params.row.status) {
        case 'requested':
          return '요청됨';
        case 'processing':
          return '처리중(승인됨)';
        case 'canceled':
          return '거절됨';
        case 'complete':
          return '완료됨';
        default:
          return `unknown status : ${params.row.status}`;
      }
    },
  },
  {
    field: 'requestDate',
    headerName: '신청일',
    minWidth: 200,
    valueFormatter: (params) => {
      return dayjs(params.value as Date).format('YYYY/MM/DD HH:mm');
    },
  },
  {
    field: 'refundAmount',
    headerName: '환불액',
    minWidth: 200,
    renderCell: ({ row }: GridRowData) => (
      <Text>
        {row?.refund?.refundAmount
          ? `${getLocaleNumber(row?.refund?.refundAmount)}원`
          : ''}
      </Text>
    ),
  },
  {
    field: 'completeDate',
    headerName: '완료일시',
    minWidth: 200,
    valueFormatter: (params) => {
      if (params.value) {
        return dayjs(params.value as Date).format('YYYY/MM/DD HH:mm');
      }
      return '';
    },
  },
];

/** 환불요청 목록 표시 컴포넌트 */
function AdminReturnListComponent({
  title,
  rows,
  onRowClick,
}: {
  title: string | JSX.Element;
  rows: DataGridProps['rows'];
  onRowClick: DataGridProps['onRowClick'];
}): JSX.Element {
  const [isOpen, { toggle }] = useBoolean(true);
  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="center">
        {typeof title === 'string' ? <Text>{title}</Text> : title}

        <Button onClick={toggle} size="xs">
          {isOpen ? '닫기' : '열기'}
        </Button>
      </Stack>

      <Collapse in={isOpen} animateOpacity>
        <ChakraDataGrid
          borderWidth={0}
          hideFooter
          headerHeight={50}
          autoHeight
          density="compact"
          rows={rows}
          columns={columns}
          rowCount={5}
          rowsPerPageOptions={[25, 50]}
          disableColumnMenu
          disableColumnFilter
          disableSelectionOnClick
          onRowClick={onRowClick}
        />
      </Collapse>
    </Stack>
  );
}
