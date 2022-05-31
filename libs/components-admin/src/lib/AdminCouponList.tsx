import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminCouponList } from '@project-lc/hooks';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { AdminCouponListDetailDialog } from './AdminCouponListDetailDialog';

export function AdminCouponList(): JSX.Element {
  const { data } = useAdminCouponList();
  const [couponDetail, setCouponDetail] = useState<GridRowData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const columns: GridColumns = [
    { field: 'id', headerName: 'id' },
    { field: 'name', headerName: '이름', flex: 1 },
    {
      field: 'unit',
      headerName: '할인유형',
      valueFormatter: ({ row }: GridRowData) => (row.unit === 'P' ? '원' : '퍼센트'),
    },
    {
      field: 'applyField',
      headerName: '유형',
      valueFormatter: ({ row }: GridRowData) =>
        row.applyField === 'goods' ? '상품할인' : '배송비할인',
    },
    {
      field: 'applyType',
      headerName: '범위',
      valueFormatter: ({ row }: GridRowData) => {
        switch (row.applyType) {
          case 'selectedGoods':
            return '선택된상품만';
          case 'exceptSelectedGoods':
            return '특성상품제외';
          case 'allGoods':
            return '모든상품';
          default:
            return '';
        }
      },
    },
    {
      field: 'createDate',
      headerName: '생성일',
      valueFormatter: ({ row }: GridRowData) =>
        dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: '시작일',
      valueFormatter: ({ row }: GridRowData) =>
        dayjs(row.startDate).format('YYYY-MM-DD HH:mm:ss'),
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: '종료일',
      valueFormatter: ({ row }: GridRowData) =>
        dayjs(row.endDate).format('YYYY-MM-DD HH:mm:ss'),
      flex: 1,
    },
    { field: 'maxDiscountAmountWon', headerName: '최대할인액', flex: 1 },
    { field: 'minOrderAmountWon', headerName: '최소주문액', flex: 1 },
    {
      field: 'detail',
      headerName: '상세보기',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleButtonClick(row)}>
          상세보기
        </Button>
      ),
    },
    {
      field: 'setting',
      headerName: '상세보기',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleSettingClick(row)}>
          관리
        </Button>
      ),
    },
  ];

  const handleButtonClick = (row: GridRowData): void => {
    setCouponDetail(row);
    onOpen();
  };

  const handleSettingClick = (row: GridRowData): void => {
    router.push(`coupon/${row.id}`);
  };
  return (
    <Box>
      <ChakraDataGrid density="compact" rows={data || []} columns={columns} minH={500} />
      <AdminCouponListDetailDialog
        isOpen={isOpen}
        onClose={onClose}
        data={couponDetail}
      />
    </Box>
  );
}
