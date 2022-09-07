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
import { useMemo, useState } from 'react';
import { CouponApplicableGoodsListDialog } from './CustomerCouponApplyGoodsList';
import { CustomerCouponDetailDialog } from './CustomerCouponDetailDialog';

/** 소비자 쿠폰 중 사용가능한 상태(사용하지 않음, 사용기간 지나지 않음)의 쿠폰만 필터링하는 훅 */
export function useValidCustomerCouponList(): {
  validCoupons: CustomerCouponRes[];
  isLoading: boolean;
} {
  const { data: coupons, isLoading } = useCustomerCouponList();
  const validCoupons = useMemo(() => {
    if (!coupons) return [];
    return coupons.filter((c) => {
      // 사용되지 않았는지 확인
      const isUsed = c.status !== 'notUsed';
      if (isUsed) return false;

      // 쿠폰 사용기간 확인
      const { startDate, endDate } = c.coupon;
      // 현재 쿠폰 사용시작일시 이후인지 (쿠폰 사용시작일시이 설정되어 있지 않으면 true)
      const isAfterStartDate = startDate ? dayjs().isAfter(dayjs(startDate)) : true;
      // 현재 쿠폰 사용종료일시 이전인지 (쿠폰 사용종료일시이 설정되어 있지 않으면 true)
      const isBeforeEndDate = endDate ? dayjs().isBefore(dayjs(endDate)) : true;

      return !isUsed && isAfterStartDate && isBeforeEndDate;
    });
  }, [coupons]);
  return { validCoupons, isLoading };
}

export function CustomerCouponList(): JSX.Element {
  const { validCoupons, isLoading } = useValidCustomerCouponList();
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
      renderCell: ({ row }) => {
        if (row.coupon.applyType !== 'selectedGoods') {
          return DiscountApplyTypeBadge(row.coupon.applyType);
        }
        // '선택상품' 인 경우에만 버튼으로 감싸서 렌더링
        return <CouponApplicableGoodsListDialog coupon={row.coupon} />;
      },
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
        rows={validCoupons}
        autoHeight
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
