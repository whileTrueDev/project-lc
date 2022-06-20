import { Box, Link, Text } from '@chakra-ui/react';
import { GridColumns, GridRowData, GridRowId, GridToolbar } from '@material-ui/data-grid';
import { OrderProcessStep } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { useAdminOrderList } from '@project-lc/hooks';
import { useSellerOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const columns: GridColumns = [
  {
    field: 'orderCode',
    headerName: '주문번호',
    renderCell: ({ row }) => (
      <NextLink href={`/order/list/${row.id}`} passHref>
        <Link href={`/order/list/${row.id}`}>
          <Text as="button" size="sm" color="blue">
            {row.orderCode}
          </Text>
        </Link>
      </NextLink>
    ),
    flex: 1,
  },
  {
    field: 'orderItem_name',
    headerName: '주문상품명',
    valueGetter: ({ row }: GridRowData) => row.orderItems[0].goods.goods_name,
    flex: 1,
  },
  {
    field: 'sellerShop',
    headerName: '판매자',
    valueGetter: ({ row }: GridRowData) =>
      row.orderItems[0].goods.seller.sellerShop.shopName,
    flex: 1,
  },
  { field: 'ordererName', headerName: '주문자명' },
  {
    field: 'paymentType',
    headerName: '결제수단',
    valueFormatter: ({ row }: GridRowData) => PaymentTypeSwitch(row.payment?.method),
  },
  { field: 'paymentPrice', headerName: '결제금액' },
  {
    field: 'step',
    headerName: '주문상태',
    renderCell: ({ row }) => (
      <Box lineHeight={2}>
        <OrderStatusBadge step={row.step as OrderProcessStep} />
      </Box>
    ),
  },
  {
    field: 'broadcaster',
    headerName: '방송인',
    valueGetter: ({ row }: GridRowData) =>
      row.sellerSettlementItems[0]?.liveShopping.broadcaster.userNickname,
  },
  {
    field: 'createDate',
    headerName: '주문날짜',
    valueFormatter: ({ row }) => dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
    type: 'date',
    flex: 1,
  },
];

function PaymentTypeSwitch(paymentType: string): string {
  switch (paymentType) {
    case 'card':
      return '카드';
    case 'virtualAccount':
      return '가상계좌';
    case 'transfer':
      return '계좌이체';
    default:
      return '';
  }
}

export function AdminOrderList(): JSX.Element {
  // 페이지당 행 select
  const rowsPerPageOptions = useRef<number[]>([10, 20, 50, 100]);
  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});
  // 페이지당 행 기본 100개
  const [pageSize, setPageSize] = useState(100);
  // 페이지
  const [page, setPage] = useState(0);

  const sellerOrderStates = useSellerOrderStore();

  const handlePageChange = (newPage: number): void => {
    if (newPage === 0 || mapPageToNextCursor.current[newPage - 1]) {
      setPage(newPage);
    }
  };

  const sellerOrderListDto = useMemo(() => {
    const { search, searchDateType, periodStart, periodEnd, searchStatuses } =
      sellerOrderStates;

    return {
      search,
      searchDateType,
      periodStart,
      periodEnd,
      searchStatuses,
      take: pageSize,
      skip: pageSize * page,
    };
  }, [page, pageSize, sellerOrderStates]);
  const { data, isLoading } = useAdminOrderList(sellerOrderListDto);
  useEffect(() => {
    if (!isLoading && data?.nextCursor) {
      // 다음페이지 존재하는 경우 page에 해당하는 인덱스에 skip의 값을 저장해둠
      mapPageToNextCursor.current[page] = data.nextCursor;
    }
  }, [data, isLoading, page]);

  // mui datagrid serverside 페이지네이션 참고 https://github.com/mui/mui-x/blob/v5.11.1/docs/data/data-grid/pagination/CursorPaginationGrid.tsx
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(data?.count || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      data?.count ? data.count : prevRowCountState,
    );
  }, [data, setRowCountState]);
  return (
    <ChakraDataGrid
      components={{
        Toolbar: GridToolbar,
      }}
      columns={columns}
      page={page}
      rowsPerPageOptions={rowsPerPageOptions.current}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rows={data?.orders || []}
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
    />
  );
}
