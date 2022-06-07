import {
  Grid,
  GridItem,
  Button,
  useDisclosure,
  useToast,
  Text,
  Heading,
  Badge,
  Box,
  Flex,
} from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import {
  useAdminCustomerCoupon,
  useAdminCustomerCouponDeleteMutation,
  useAdminCustomer,
  useAdminCustomerCouponPostMutation,
  useAdminAllCustomerCouponPostMutation,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { AdminCustomerCouponStatusDialog } from '@project-lc/components-admin/AdminCustomerCouponStatusDialog';
import { useState } from 'react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { CouponStatus } from '@prisma/client';

export function CouponManage(): JSX.Element {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

  const {
    isOpen: issueIsOpen,
    onOpen: issueOnOpen,
    onClose: issueOnClose,
  } = useDisclosure();

  const {
    isOpen: issueAllIsOpen,
    onOpen: issueAllOnOpen,
    onClose: issueAllOnClose,
  } = useDisclosure();

  const toast = useToast();
  const [rowData, setRowData] = useState<GridRowData>();
  const [customerRowData, setCustomerRowData] = useState<GridRowData>();
  const [toDelete, setToDelete] = useState<GridRowData>();
  const { mutateAsync } = useAdminCustomerCouponDeleteMutation();
  const { mutateAsync: couponIssueMutateAsync } = useAdminCustomerCouponPostMutation();
  const { mutateAsync: couponIssueAllMutateAsync } =
    useAdminAllCustomerCouponPostMutation();
  const { couponId } = router.query;
  const { data } = useAdminCustomerCoupon({ couponId: Number(couponId) });
  const { data: customerData } = useAdminCustomer({
    orderBy: 'desc',
    orderByColumn: 'createDate',
    includeModels: ['coupons'],
  });
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
    {
      field: 'status',
      headerName: '사용여부',
      renderCell: ({ row }: GridRowData) => CouponUsageStatusBadge(row.status),
    },
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

  const customerColumns: GridColumns = [
    {
      field: 'id',
      headerName: 'id',
      width: 20,
    },
    {
      field: 'email',
      headerName: 'email',
      width: 100,
      flex: 1,
    },
    {
      field: 'nickname',
      headerName: '닉네임',
      width: 100,
      flex: 1,
    },
    {
      field: 'button',
      headerName: '발급',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleIssuerButtonOnClick(row)}>
          발급
        </Button>
      ),
    },
  ];
  const handleDeleteButtonOnClick = (row: GridRowData): void => {
    setToDelete(row);
    deleteOnOpen();
  };

  const handleIssuerButtonOnClick = (row: GridRowData): void => {
    setCustomerRowData(row);
    issueOnOpen();
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

  const handleIssueCoupon = (): Promise<void> =>
    couponIssueMutateAsync({
      couponId: Number(couponId),
      customerId: customerRowData.id,
      status: 'notUsed',
    })
      .then(() => {
        toast({
          description: '발행완료',
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          description: '발행실패',
          status: 'error',
        });
      });

  const handleAllIssueCoupon = (): Promise<void> =>
    couponIssueAllMutateAsync({
      couponId: Number(couponId),
      customerId: 0,
      status: 'notUsed',
    })
      .then((result: number) => {
        toast({
          description: `${result}개 발행완료`,
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          description: '발행실패',
          status: 'error',
        });
      });

  return (
    <AdminPageLayout>
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
          <Flex justifyContent="space-between">
            <Heading size="lg">고객 목록</Heading>
            <Button onClick={issueAllOnOpen} colorScheme="blue">
              일괄발급
            </Button>
          </Flex>
          {data && (
            <ChakraDataGrid
              rows={customerData || []}
              columns={customerColumns}
              minH={500}
              density="compact"
            />
          )}

          <ConfirmDialog
            title="발급확인"
            isOpen={issueIsOpen}
            onClose={issueOnClose}
            onConfirm={handleIssueCoupon}
          >
            <Text>{customerRowData?.email} 님에게 쿠폰을</Text>
            <Text>발급하시겠습니까?</Text>
          </ConfirmDialog>
          <ConfirmDialog
            title="일괄발급확인"
            isOpen={issueAllIsOpen}
            onClose={issueAllOnClose}
            onConfirm={handleAllIssueCoupon}
          >
            <Text>모든 고객에게 일괄 발급하시겠습니까?</Text>
          </ConfirmDialog>
        </GridItem>
      </Grid>
    </AdminPageLayout>
  );
}

export function CouponUsageStatusBadge(status: CouponStatus): JSX.Element {
  switch (status) {
    case 'notUsed':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="blue">미사용</Badge>
        </Box>
      );
    case 'expired':
      return (
        <Box lineHeight={2}>
          <Badge>만료</Badge>
        </Box>
      );
    case 'used':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="red">사용됨</Badge>
        </Box>
      );
    default:
  }
}

export default CouponManage;