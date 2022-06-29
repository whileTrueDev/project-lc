import {
  Stack,
  Text,
  Box,
  Spinner,
  ModalBody,
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { GridColumns, GridRowParams } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminReturnList } from '@project-lc/hooks';
import { AdminReturnData } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
import AdminReturnRequestDetail from './AdminReturnRequestDetail';

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
          return '처리중(판매자가 환불 승인함)';
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
    field: 'reason',
    headerName: '사유',
    minWidth: 200,
  },
];

/** 판매자에 의해 승인된 소비자의 환불요청 목록
 * 해당 요청, 주문 내용 확인 가능 */
export function AdminReturnRequestList(): JSX.Element {
  const dialog = useDisclosure();
  const { data, isLoading } = useAdminReturnList();

  const [selectedRequest, setSelectedRequest] = useState<AdminReturnData | null>(null);

  const handleRowClick = (param: GridRowParams): void => {
    setSelectedRequest(param.row as AdminReturnData);
    dialog.onOpen();
  };

  const handleClose = (): void => {
    dialog.onClose();
    setSelectedRequest(null);
  };

  if (isLoading) return <Spinner />;
  if (!data) return <Text>환불요청이 없습니다</Text>;
  return (
    <Stack>
      <Text>
        판매자에 의해 승인된 소비자의 환불요청 목록. 클릭시 해당 요청, 주문 내용 확인 가능
        환불처리
      </Text>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        rows={data}
        columns={columns}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
        onRowClick={handleRowClick}
      />

      <Modal isOpen={dialog.isOpen} onClose={handleClose} size="3xl">
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
