import { Box } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useCustomerCouponHistory } from '@project-lc/hooks';
import { ActionTypeBadge } from '@project-lc/components-shared/CouponBadge';

const column: GridColumns = [
  {
    field: 'couponName',
    headerName: '쿠폰이름',
    valueGetter: ({ row }: GridRowData) => row.customerCoupon.coupon.name,
    flex: 1,
  },
  {
    field: 'type',
    headerName: '유형',
    renderCell: ({ row }: GridRowData) => ActionTypeBadge(row.type),
    flex: 1,
  },
  {
    field: 'createDate',
    headerName: '날짜',
    valueFormatter: ({ row }: GridRowData) =>
      dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
    flex: 1,
  },
];

export function CustomerCouponHistoryList(): JSX.Element {
  const { data } = useCustomerCouponHistory();
  return (
    <Box>
      <ChakraDataGrid rows={data || []} columns={column} minH={500} density="compact" />
    </Box>
  );
}
