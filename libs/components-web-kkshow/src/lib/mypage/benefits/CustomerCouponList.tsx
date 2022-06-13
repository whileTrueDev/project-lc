import { Button, useDisclosure } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CustomerCoupon } from '@prisma/client';
import {
  DiscountApplyFieldBadge,
  DiscountApplyTypeBadge,
} from '@project-lc/components-shared/CouponBadge';
import { CustomerCouponDetailDialog } from './CustomerCouponDetailDialog';

type CustomerCouponListProps = {
  data: CustomerCoupon[] | undefined;
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
      renderCell: ({ row }: GridRowData) =>
        DiscountApplyFieldBadge(row.coupon.applyField),
      flex: 1,
    },
    {
      field: 'applyType',
      headerName: '적용대상',
      renderCell: ({ row }: GridRowData) => DiscountApplyTypeBadge(row.coupon.applyType),
      flex: 1,
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
            minH={500}
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
