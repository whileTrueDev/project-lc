import { Box, Button, useDisclosure, useToast, Text } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminCouponList, useAdminCouponDeleteMutation } from '@project-lc/hooks';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { AdminCouponListDetailDialog } from './AdminCouponListDetailDialog';

export function AdminCouponList(): JSX.Element {
  const toast = useToast();
  const { data } = useAdminCouponList();
  const { mutateAsync } = useAdminCouponDeleteMutation();
  const [couponDetail, setCouponDetail] = useState<GridRowData>();
  const [couponToDelete, setCouponToDelete] = useState<GridRowData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

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
        row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD HH:mm:ss') : '미정',
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
    {
      field: 'delete',
      headerName: '삭제',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleCouponDeleteClick(row)}>
          삭제
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

  const handleCouponDeleteClick = (row: GridRowData): void => {
    setCouponToDelete(row);
    deleteOnOpen();
  };

  const handleCouponDelete = (): Promise<void> =>
    mutateAsync(couponToDelete?.id)
      .then(() => {
        toast({
          description: '삭제완료',
          status: 'success',
        });
        deleteOnClose();
      })
      .catch(() => {
        toast({
          description: '삭제실패',
          status: 'error',
        });
      });
  return (
    <Box>
      <ChakraDataGrid density="compact" rows={data || []} columns={columns} minH={500} />
      <AdminCouponListDetailDialog
        isOpen={isOpen}
        onClose={onClose}
        data={couponDetail}
      />
      <ConfirmDialog
        title="일괄발급확인"
        isOpen={deleteIsOpen}
        onClose={deleteOnClose}
        onConfirm={handleCouponDelete}
      >
        <Text>삭제하시겠습니까?</Text>
      </ConfirmDialog>
    </Box>
  );
}
