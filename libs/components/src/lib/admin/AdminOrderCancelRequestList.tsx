import { Spinner } from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { useAdminOrderCancelRequest } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { ChakraDataGrid } from '../ChakraDataGrid';

const columns: GridColumns = [
  {
    field: 'id',
    headerName: '번호',
    width: 100,
  },
  {
    field: 'seller',
    headerName: '판매자',
    minWidth: 200,
    valueGetter: (params) => {
      return params.row.seller.email;
    },
  },
  {
    field: 'orderSeq',
    headerName: '주문번호',
    minWidth: 200,
  },
  {
    field: 'createDate',
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

export function AdminOrderCancelRequestList(): JSX.Element {
  const orderCancelRequest = useAdminOrderCancelRequest();
  if (orderCancelRequest.isLoading) return <Spinner />;
  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      rows={orderCancelRequest.data}
      columns={columns}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}

export default AdminOrderCancelRequestList;
