import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  Link,
  Text,
  useButtonGroup,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  GridColumns,
  GridRowData,
  GridRowId,
  GridSelectionModel,
  GridToolbar,
} from '@material-ui/data-grid';
import { OrderProcessStep } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import {
  useDelieveryDoneManyMutation,
  useDelieveryStartManyMutation,
  useExports,
} from '@project-lc/hooks';
import {
  convertkkshowOrderStatusToString,
  ExportListItem,
} from '@project-lc/shared-types';
import { useAdminOrderExportListStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaTruck } from 'react-icons/fa';

const columns: GridColumns = [
  {
    width: 130,
    field: 'exportCode',
    headerName: '출고번호',
    renderCell: ({ row }) => (
      <NextLink href={`/order/exports/${row.exportCode}`} passHref>
        <Link href={`/order/exports/${row.exportCode}`}>
          <Text as="button" size="sm" color="blue">
            {row.exportCode}
          </Text>
        </Link>
      </NextLink>
    ),
  },
  {
    minWidth: 180,
    field: 'orderItem_name',
    headerName: '주문상품명',
    valueGetter: ({ row }: GridRowData) =>
      row.items.length > 1
        ? `${row.items[0].goodsName} 외 ${row.items.length} 개의 상품`
        : row.items[0].goodsName,
    flex: 1,
  },
  {
    width: 130,
    field: 'seller.sellerShop.shopName',
    headerName: '판매자',
    valueGetter: ({ row }: GridRowData) => row.seller?.sellerShop?.shopName,
  },
  {
    width: 120,
    field: 'order.ordererName',
    headerName: '주문자',
    valueGetter: ({ row }) => row.order.ordererName,
    renderCell: ({ row }) => <Text>{row.order.ordererName}</Text>,
  },
  { width: 120, field: 'deliveryCompany', headerName: '배송사' },
  { width: 120, field: 'deliveryNumber', headerName: '송장번호' },
  {
    field: 'status',
    headerName: '출고상태',
    valueGetter: ({ row }) => convertkkshowOrderStatusToString(row.status),
    renderCell: ({ row }) => (
      <Box lineHeight={2}>
        <OrderStatusBadge step={row.status as OrderProcessStep} />
      </Box>
    ),
  },
  {
    field: 'createDate',
    headerName: '출고날짜',
    valueFormatter: ({ row }) => dayjs(row.exportDate).format('YYYY-MM-DD HH:mm:ss'),
    valueGetter: ({ row }) => row.exportDate,
    type: 'date',
    width: 160,
  },
];

export function AdminOrderExportList(): JSX.Element {
  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});
  const rowsPerPageOptions = useRef<number[]>([1, 10, 20, 50, 100]); // 페이지당 행 select
  const [pageSize, setPageSize] = useState(100); // 페이지당 행 기본 100개
  const [page, setPage] = useState(0); // 페이지
  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const { data, isLoading } = useExports({
    withSellerInfo: true,
    skip: pageSize * page,
    take: pageSize,
  });
  useEffect(() => {
    if (!isLoading && data?.edges && data.nextCursor) {
      // 다음페이지 존재하는 경우 page에 해당하는 인덱스에 skip의 값을 저장해둠
      mapPageToNextCursor.current[page] = data.nextCursor;
    }
  }, [data, isLoading, page]);

  // mui datagrid serverside 페이지네이션 참고 https://github.com/mui/mui-x/blob/v5.11.1/docs/data/data-grid/pagination/CursorPaginationGrid.tsx
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(data?.totalCount || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.totalCount ? data.totalCount : prevRowCountState,
    );
  }, [data, setRowCountState]);

  // * 출고 선택
  const { selectedItems, onSelectedItemsChange, setSelectedExports } =
    useAdminOrderExportListStore();
  const _onSelectedItemsChange = (m: GridSelectionModel): void => {
    onSelectedItemsChange(m);
    const targets = data?.edges
      .filter((x) => m.includes(x.id))
      .filter((x) => !!x.exportCode);
    if (targets) setSelectedExports(targets);
  };

  return (
    <>
      <Box>
        <ButtonGroup size="sm" isDisabled={!(selectedItems.length > 0)}>
          <DeliveryStartManyConfirmDialogButton />
          <DeliveryDoneManyConfirmDialogButton />
        </ButtonGroup>
      </Box>
      <ChakraDataGrid
        components={{ Toolbar: GridToolbar }}
        columns={columns}
        page={page}
        rowsPerPageOptions={rowsPerPageOptions.current}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rows={data?.edges || []}
        minH={500}
        autoHeight
        loading={isLoading}
        disableSelectionOnClick
        pageSize={pageSize}
        pagination
        rowCount={rowCountState}
        density="compact"
        paginationMode="server"
        onPageChange={handlePageChange}
        checkboxSelection
        onSelectionModelChange={_onSelectedItemsChange}
        selectionModel={selectedItems}
      />
    </>
  );
}

type DeliveryStartManyConfirmDialogProps = Pick<
  ConfirmDialogProps,
  'onClose' | 'isOpen'
> & {
  targets: ExportListItem[];
};
function DeliveryStartManyConfirmDialog({
  isOpen,
  onClose,
  targets,
}: DeliveryStartManyConfirmDialogProps): JSX.Element {
  const toast = useToast();
  const resetSelectedExports = useAdminOrderExportListStore(
    (s) => s.resetSelectedExports,
  );
  const deliveryStartMany = useDelieveryStartManyMutation();
  const onDeliveryStartMany = async (): Promise<void> => {
    if (targets.length <= 0)
      toast({
        status: 'warning',
        title: '선택된 출고중 배송중처리할 수 있는 출고(배송중상태의 출고)가 없습니다.',
      });
    else {
      deliveryStartMany
        .mutateAsync({
          deliveryDTOs: targets.map((exp) => ({
            exportCode: exp.exportCode as string,
            status: 'shipping',
          })),
        })
        .then(() => {
          resetSelectedExports();
          toast({ status: 'success', title: '일괄 배송중 처리 성공' });
        })
        .catch((err) => {
          toast({
            status: 'error',
            title: '일괄 배송중 처리 실패',
            description: err.response?.data?.message,
          });
        });
    }
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="일괄배송중처리"
      onConfirm={onDeliveryStartMany}
    >
      선택된 모든 출고의 상태를 배송중으로 상태를 변경할까요?
    </ConfirmDialog>
  );
}

function DeliveryStartManyConfirmDialogButton(props: ButtonProps): JSX.Element {
  const btnGrpProps = useButtonGroup();
  // 다중 배송중처리
  const deliveryStartDialog = useDisclosure();
  const selectedExports = useAdminOrderExportListStore((s) => s.selectedExports);
  const targets = selectedExports.filter((exp) =>
    ['exportDone', 'partialExportDone'].includes(exp.status),
  );

  return (
    <>
      <Button
        {...btnGrpProps}
        {...props}
        isDisabled={targets.length <= 0 || btnGrpProps.isDisabled || props.isDisabled}
        leftIcon={<FaTruck />}
        colorScheme="purple"
        onClick={deliveryStartDialog.onOpen}
      >
        일괄배송중처리
      </Button>
      <DeliveryStartManyConfirmDialog
        isOpen={deliveryStartDialog.isOpen}
        onClose={deliveryStartDialog.onClose}
        targets={targets}
      />
    </>
  );
}

type DeliveryDoneManyConfirmDialogProps = Pick<
  ConfirmDialogProps,
  'onClose' | 'isOpen'
> & {
  targets: ExportListItem[];
};
function DeliveryDoneManyConfirmDialog({
  isOpen,
  onClose,
  targets,
}: DeliveryDoneManyConfirmDialogProps): JSX.Element {
  const toast = useToast();
  const resetSelectedExports = useAdminOrderExportListStore(
    (s) => s.resetSelectedExports,
  );
  const deliveryDoneMany = useDelieveryDoneManyMutation();
  const onDeliveryDoneMany = async (): Promise<void> => {
    if (targets.length <= 0)
      toast({
        status: 'warning',
        title: '선택된 출고중 배송완료처리할 수 있는 출고(배송중상태의 출고)가 없습니다.',
      });
    else {
      deliveryDoneMany
        .mutateAsync({
          deliveryDTOs: targets.map((exp) => ({
            exportCode: exp.exportCode as string,
            status: 'shippingDone',
          })),
        })
        .then(() => {
          resetSelectedExports();
          toast({ status: 'success', title: '일괄 배송완료 처리 성공' });
        })
        .catch((err) => {
          toast({
            status: 'error',
            title: '일괄 배송완료 처리 실패',
            description: err.response?.data?.message,
          });
        });
    }
  };
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title="일괄배송완료처리"
      onConfirm={onDeliveryDoneMany}
    >
      선택된 모든 출고의 상태를 배송완료로 상태를 변경할까요?
    </ConfirmDialog>
  );
}

function DeliveryDoneManyConfirmDialogButton(props: ButtonProps): JSX.Element {
  const btnGrpProps = useButtonGroup();
  // 다중 배송중처리
  const deliveryDoneDialog = useDisclosure();
  const selectedExports = useAdminOrderExportListStore((s) => s.selectedExports);
  const targets = selectedExports.filter((exp) =>
    ['shipping', 'partialShipping'].includes(exp.status),
  );
  return (
    <>
      <Button
        {...btnGrpProps}
        {...props}
        leftIcon={<FaTruck />}
        colorScheme="messenger"
        isDisabled={targets.length <= 0 || btnGrpProps.isDisabled || props.isDisabled}
        onClick={deliveryDoneDialog.onOpen}
      >
        일괄배송완료처리
      </Button>
      <DeliveryDoneManyConfirmDialog
        isOpen={deliveryDoneDialog.isOpen}
        onClose={deliveryDoneDialog.onClose}
        targets={targets}
      />
    </>
  );
}
