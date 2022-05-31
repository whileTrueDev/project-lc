import {
  Grid,
  GridItem,
  Button,
  useDisclosure,
  useToast,
  Text,
  Heading,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import {
  useAdminCustomerCoupon,
  useAdminCustomerCouponDeleteMutation,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { AdminCustomerCouponStatusDialog } from '@project-lc/components-admin/AdminCustomerCouponStatusDialog';
import { useState } from 'react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';

const logsColumns: GridColumns = [
  { field: 'id' },
  {
    field: 'email',
    headerName: 'email',
    valueGetter: ({ row }: GridRowData) => row.customer.email,
  },
  {
    field: 'nickname',
    headerName: '닉네임',
    valueGetter: ({ row }: GridRowData) => row.customer.nickname,
  },
  { field: 'status', headerName: '사용여부' },
  { field: 'setting', headerName: '설정' },
];

export function CouponManage(): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

  const toast = useToast();
  const [rowData, setRowData] = useState<GridRowData>();
  const [toDelete, setToDelete] = useState<GridRowData>();
  const { mutateAsync } = useAdminCustomerCouponDeleteMutation();
  const { couponId } = router.query;
  const { data } = useAdminCustomerCoupon({ couponId: Number(couponId) });
  const columns: GridColumns = [
    { field: 'id' },
    {
      field: 'email',
      headerName: 'email',
      valueGetter: ({ row }: GridRowData) => row.customer.email,
      flex: 1,
    },
    {
      field: 'nickname',
      headerName: '닉네임',
      valueGetter: ({ row }: GridRowData) => row.customer.nickname,
      flex: 1,
    },
    { field: 'status', headerName: '사용여부' },
    {
      field: 'setting',
      headerName: '설정',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            onOpen();
            setRowData(row);
          }}
        >
          관리
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: '설정',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            handleDeleteButtonOnClick(row);
          }}
        >
          삭제
        </Button>
      ),
    },
  ];

  const handleDeleteButtonOnClick = (row: GridRowData): void => {
    setToDelete(row);
    deleteOnOpen();
  };

  const handleDelete = (): Promise<void> =>
    mutateAsync(toDelete.id)
      .then(() => {
        toast({
          description: '삭제완료',
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          description: '삭제실패',
          status: 'error',
        });
      });

  return (
    <AdminPageLayout>
      <Button>쿠폰 발급하기</Button>
      <Grid templateColumns="repeat(2, 2fr)" gap={3}>
        <GridItem colSpan={1}>
          <Heading size="lg">쿠폰 발행 목록</Heading>
          {data && (
            <ChakraDataGrid
              rows={data || []}
              columns={columns}
              minH={500}
              density="compact"
            />
          )}
          <AdminCustomerCouponStatusDialog
            isOpen={isOpen}
            onClose={onClose}
            data={rowData}
          />
          <ConfirmDialog
            title="삭제하시겠습니까?"
            isOpen={deleteIsOpen}
            onClose={deleteOnClose}
            onConfirm={handleDelete}
          >
            <Text>{toDelete?.customer.email} 님의 쿠폰을</Text>
            <Text>삭제하시겠습니까?</Text>
          </ConfirmDialog>
        </GridItem>
        <GridItem colSpan={1}>
          <Heading size="lg">쿠폰 사용 로그</Heading>
          {data && (
            <ChakraDataGrid
              rows={data || []}
              columns={columns}
              minH={500}
              density="compact"
            />
          )}
        </GridItem>
      </Grid>
    </AdminPageLayout>
  );
}

export default CouponManage;
