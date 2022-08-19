import { Button, useDisclosure } from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  DiscountApplyFieldBadge,
  DiscountApplyTypeBadge,
} from '@project-lc/components-shared/CouponBadge';
import { useCustomerCouponList } from '@project-lc/hooks';
import { CustomerCouponRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CustomerCouponDetailDialog } from './CustomerCouponDetailDialog';

export function CustomerCouponList(): JSX.Element {
  const { isLoading, data: coupons } = useCustomerCouponList();
  const [couponDetail, setCouponDetail] = useState<CustomerCouponRes>();

  const handleButtonClick = (coupon: CustomerCouponRes): void => {
    setCouponDetail(coupon);
    onOpen();
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  const columns: GridColumns = [
    {
      width: 200,
      field: 'couponName',
      headerName: '이름',
      valueGetter: ({ row }) => row.coupon.name,
    },
    {
      field: 'amount',
      headerName: '할인',
      valueFormatter: ({ row }) =>
        row.coupon.unit === 'P'
          ? `${row.coupon.amount}%`
          : `${row.coupon.amount.toLocaleString()}원`,
    },
    {
      field: 'applyField',
      headerName: '종류',
      renderCell: ({ row }) => DiscountApplyFieldBadge(row.coupon.applyField),
    },
    {
      field: 'applyType',
      headerName: '적용대상',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => DiscountApplyTypeBadge(row.coupon.applyType),
    },
    {
      field: 'endDate',
      headerName: '사용기한',
      width: 120,
      valueFormatter: ({ row }) =>
        row.coupon.endDate
          ? dayjs(row.coupon.endDate).format('YYYY-MM-DD HH:mm:ss')
          : '없음',
    },
    {
      field: 'detail',
      headerName: '상세',
      renderCell: ({ row }) => (
        <Button size="xs" onClick={() => handleButtonClick(row as CustomerCouponRes)}>
          상세정보
        </Button>
      ),
    },
  ];

  return (
    <>
      <ChakraDataGrid
        loading={isLoading}
        columns={columns}
        rows={coupons || []}
        minH={500}
        disableColumnMenu
        disableColumnFilter
        density="compact"
      />
      {couponDetail && (
        <CustomerCouponDetailDialog
          isOpen={isOpen}
          onClose={onClose}
          customerCoupon={couponDetail}
        />
      )}
    </>
  );
}
