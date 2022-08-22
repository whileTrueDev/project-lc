import { Box } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useCustomerCouponHistory } from '@project-lc/hooks';
import { ActionTypeBadge } from '@project-lc/components-shared/CouponBadge';

const column: GridColumns = [
  {
    width: 200,
    field: 'couponName',
    headerName: '쿠폰명',
    valueGetter: ({ row }: GridRowData) => row.customerCoupon.coupon.name,
  },
  {
    width: 80,
    field: 'type',
    headerName: '유형',
    sortable: false,
    renderCell: ({ row }: GridRowData) => ActionTypeBadge(row.type),
  },
  {
    width: 160,
    field: 'createDate',
    headerName: '날짜',
    valueFormatter: ({ row }: GridRowData) =>
      dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
  },
];

export function CustomerCouponHistoryList(): JSX.Element {
  const { data, isLoading } = useCustomerCouponHistory();
  return (
    <Box>
      <ChakraDataGrid
        loading={isLoading}
        rows={data || []}
        columns={column}
        minH={500}
        density="compact"
      />
    </Box>
  );
}
