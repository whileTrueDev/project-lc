import { Box, Link, Text } from '@chakra-ui/react';
import { GridColumns, GridRowData, GridRowId, GridToolbar } from '@material-ui/data-grid';
import { OrderProcessStep } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { useExports } from '@project-lc/hooks';
import { convertkkshowOrderStatusToString } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useEffect, useRef, useState } from 'react';

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
    skip: page,
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
  return (
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
    />
  );
}
