import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CustomerCoupon, Coupon } from '@prisma/client';
import { useCustomerCouponHistory } from '@project-lc/hooks';
import { CustomerCouponDetailDialog } from './CustomerCouponDetailDialog';

const column: GridColumns = [
  { field: 'id', valueGetter: ({ row }: GridRowData) => row.logs.id },
  {
    field: 'couponName',
    headerName: '쿠폰명',
    valueGetter: ({ row }: GridRowData) => row.coupon.name,
  },
  { field: 'type', headerName: '유형' },
];

export function CustomerCouponHistoryList(): JSX.Element {
  const { data } = useCustomerCouponHistory();
  console.log(data);
  return (
    <Box>
      <ChakraDataGrid rows={data || []} columns={column} />
    </Box>
  );
}
