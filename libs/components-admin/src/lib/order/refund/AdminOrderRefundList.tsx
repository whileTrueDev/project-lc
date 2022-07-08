import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns, GridRowParams } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminRefundList } from '@project-lc/hooks';
import { AdminRefundData } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
import AdminOrderRefundDetail from './AdminOrderRefundDetail';

const columns: GridColumns = [
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
    field: 'completeDate',
    headerName: '환불처리일시',
    minWidth: 200,
    valueFormatter: (params) => {
      return dayjs(params.value as Date).format('YYYY/MM/DD HH:mm');
    },
  },
  {
    field: 'refundAmount',
    headerName: '환불금액',
    minWidth: 120,
  },
];
/**  */
export function AdminOrderRefundList(): JSX.Element {
  const dialog = useDisclosure();
  const { data } = useAdminRefundList();

  const [selectedRefund, setSelectedRefund] = useState<AdminRefundData | null>(null);

  const handleRowClick = (param: GridRowParams): void => {
    setSelectedRefund(param.row as AdminRefundData);
    dialog.onOpen();
  };
  const handleClose = (): void => {
    dialog.onClose();
    setSelectedRefund(null);
  };

  return (
    <Stack>
      <Text>처리한 환불요청 내역</Text>
      <ChakraDataGrid
        borderWidth={0}
        hideFooter
        headerHeight={50}
        minH={300}
        density="compact"
        rows={data || []}
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
          <ModalHeader>환불요청 처리내역</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AdminOrderRefundDetail refundData={selectedRefund} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default AdminOrderRefundList;
