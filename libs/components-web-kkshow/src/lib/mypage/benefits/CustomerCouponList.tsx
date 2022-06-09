import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CustomerCoupon, Coupon } from '@prisma/client';
import { CustomerCouponDetailDialog } from './CustomerCouponDetailDialog';

type CustomerCouponListProps = {
  data: CustomerCoupon[];
};

export function CustomerCouponList(props: CustomerCouponListProps): JSX.Element {
  const { data } = props;
  const [couponDetail, setCouponDetail] = useState<GridRowData>({});

  const handleButtonClick = (coupon: GridRowData): void => {
    setCouponDetail(coupon);
    onOpen();
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  const columns: GridColumns = [
    {
      field: 'couponName',
      headerName: '이름',
      valueGetter: ({ row }: GridRowData) => row.coupon.name,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: '할인',
      valueFormatter: ({ row }: GridRowData) =>
        row.coupon.unit === 'P'
          ? `${row.coupon.amount}%`
          : `${row.coupon.amount.toLocaleString()}원`,
    },
    {
      field: 'applyField',
      headerName: '종류',
      valueFormatter: ({ row }: GridRowData) =>
        row.coupon.applyField === 'goods' ? '제품할인' : '배송비할인',
    },
    {
      field: 'applyField',
      headerName: '적용대상',
      valueFormatter: ({ row }: GridRowData) =>
        row.coupon.applyType === 'allGoods' ? '모든 품목' : '일부 품목 제외',
    },
    {
      field: 'endDate',
      headerName: '사용기한',
      valueFormatter: ({ row }: GridRowData) =>
        row.coupon.endDate
          ? dayjs(row.coupon.endDate).format('YYYY-MM-DD HH:mm:ss')
          : '없음',
      flex: 1,
    },
    {
      field: 'detail',
      headerName: '상세',
      renderCell: ({ row }) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          상세정보
        </Button>
      ),
    },
  ];

  return (
    <>
      {data && (
        <>
          <ChakraDataGrid
            columns={columns}
            rows={data || []}
            minH={400}
            disableColumnMenu
            disableColumnFilter
          />
          <CustomerCouponDetailDialog
            isOpen={isOpen}
            onClose={onClose}
            data={couponDetail}
          />
        </>
      )}
    </>
  );
}
