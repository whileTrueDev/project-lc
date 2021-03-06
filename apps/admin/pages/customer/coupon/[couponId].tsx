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
import {
  GridColumns,
  GridRowData,
  GridSelectionModel,
  GridToolbar,
} from '@material-ui/data-grid';
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
  const [manyCustomerCouponIssue, setManyCustomerCouponIssue] =
    useState<GridSelectionModel>([]);

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
      headerName: '?????????',
      valueGetter: ({ row }: GridRowData) => row.customer.nickname,
      flex: 1,
    },
    {
      field: 'status',
      headerName: '????????????',
      renderCell: ({ row }: GridRowData) => CouponUsageStatusBadge(row.status),
    },
    {
      field: 'setting',
      headerName: '??????',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            onOpen();
            setRowData(row);
          }}
        >
          ??????
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: '??????',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            handleDeleteButtonOnClick(row);
          }}
        >
          ??????
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
      headerName: '?????????',
      width: 100,
      flex: 1,
    },
    {
      field: 'button',
      headerName: '??????',
      renderCell: ({ row }: GridRowData) => (
        <Button size="xs" onClick={() => handleIssueButtonOnClick(row)}>
          ??????
        </Button>
      ),
    },
  ];
  const handleDeleteButtonOnClick = (row: GridRowData): void => {
    setToDelete(row);
    deleteOnOpen();
  };

  const handleIssueButtonOnClick = (row: GridRowData): void => {
    setCustomerRowData(row);
    issueOnOpen();
  };

  const handleDelete = (): Promise<void> =>
    mutateAsync(toDelete.id)
      .then(() => {
        toast({
          description: '????????????',
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          description: '????????????',
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
          description: '????????????',
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          description: '????????????',
          status: 'error',
        });
      });

  const handleAllIssueCoupon = (): Promise<void> =>
    couponIssueAllMutateAsync({
      couponId: Number(couponId),
      customerIds: manyCustomerCouponIssue as number[],
      status: 'notUsed',
    })
      .then((result: number) => {
        toast({
          description: `${result}??? ????????????`,
          status: 'success',
        });
        setManyCustomerCouponIssue([]);
      })
      .catch(() => {
        toast({
          description: '????????????',
          status: 'error',
        });
      });

  return (
    <AdminPageLayout>
      <Grid templateColumns="repeat(2, 2fr)" gap={3}>
        <GridItem colSpan={1}>
          <Heading size="lg">?????? ?????? ??????</Heading>
          {data && (
            <ChakraDataGrid
              rows={data || []}
              columns={columns}
              minH={500}
              density="compact"
              components={{
                Toolbar: GridToolbar,
              }}
            />
          )}
          <AdminCustomerCouponStatusDialog
            isOpen={isOpen}
            onClose={onClose}
            data={rowData}
          />
          <ConfirmDialog
            title="?????????????????????????"
            isOpen={deleteIsOpen}
            onClose={deleteOnClose}
            onConfirm={handleDelete}
          >
            <Text>{toDelete?.customer.email} ?????? ?????????</Text>
            <Text>?????????????????????????</Text>
          </ConfirmDialog>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex justifyContent="space-between">
            <Heading size="lg">?????? ??????</Heading>
            <Flex direction="column">
              <Button onClick={issueAllOnOpen} colorScheme="blue">
                ??????/?????? ??????
              </Button>
            </Flex>
          </Flex>
          <Text>
            * ??????????????? ????????? ???????????? ????????? ?????? ??????????????? ????????? ???????????????.
          </Text>
          {data && (
            <ChakraDataGrid
              rows={customerData || []}
              columns={customerColumns}
              minH={500}
              density="compact"
              onSelectionModelChange={(newSelectionModel) => {
                setManyCustomerCouponIssue(newSelectionModel as number[]);
              }}
              selectionModel={manyCustomerCouponIssue}
              checkboxSelection
              components={{
                Toolbar: GridToolbar,
              }}
            />
          )}

          <ConfirmDialog
            title="????????????"
            isOpen={issueIsOpen}
            onClose={issueOnClose}
            onConfirm={handleIssueCoupon}
          >
            <Text>{customerRowData?.email} ????????? ?????????</Text>
            <Text>?????????????????????????</Text>
          </ConfirmDialog>
          <ConfirmDialog
            title="??????????????????"
            isOpen={issueAllIsOpen}
            onClose={issueAllOnClose}
            onConfirm={handleAllIssueCoupon}
          >
            <Text>
              {manyCustomerCouponIssue.length !== 0
                ? `${manyCustomerCouponIssue.length} ?????? ???????????? ?????? ?????????????????????????`
                : '?????? ???????????? ?????? ?????????????????????????'}
            </Text>
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
          <Badge colorScheme="blue">?????????</Badge>
        </Box>
      );
    case 'expired':
      return (
        <Box lineHeight={2}>
          <Badge>??????</Badge>
        </Box>
      );
    case 'used':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="red">?????????</Badge>
        </Box>
      );
    default:
  }
}

export default CouponManage;
