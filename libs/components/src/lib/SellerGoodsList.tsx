/* eslint-disable camelcase */
import { Badge, Box, Text } from '@chakra-ui/react';
import { useProfile, useSellerGoodsList } from '@project-lc/hooks';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import {
  GoodsConfirmationStatuses,
  GoodsStatus,
  GoodsView,
  RunoutPolicy,
} from '@prisma/client';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import { ChakraDataGrid } from './ChakraDataGrid';
import {
  RUNOUT_POLICY,
  GOODS_STATUS,
  GOODS_VIEW,
  GOODS_CONFIRMATION_STATUS,
} from '../constants/goodsStatus';

function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString();
  return `${formattedPrice}원`;
}
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
}

const columns: GridColumns = [
  { field: 'id', headerName: 'ID', width: 40, sortable: false },
  { field: 'goods_name', headerName: '상품명', sortable: false },
  {
    field: 'default_price',
    headerName: '판매가',
    type: 'number',
    valueFormatter: ({ row }) => formatPrice(Number(row.default_price)),
    sortable: false,
  },
  {
    field: 'default_consumer_price',
    headerName: '정가',
    type: 'number',
    valueFormatter: ({ row }) => formatPrice(Number(row.default_consumer_price)),
    sortable: false,
  },
  {
    field: 'runout_policy',
    headerName: '재고판매',
    align: 'center',
    valueGetter: ({ row }) => {
      return RUNOUT_POLICY[row.runout_policy as RunoutPolicy];
    },
    sortable: false,
  },
  { field: 'shipping_policy', headerName: '배송비', sortable: false }, // TODO: 배송비 정책 혹은 상품 등록 진행 후 배송비 정책 연결 필요
  {
    field: 'date',
    headerName: '등록일/수정일',
    width: 150,
    renderCell: ({ row }) => {
      const { regist_date, update_date } = row;
      return (
        <Box>
          <Text height="20px">{formatDate(regist_date as Date)}</Text>
          <Text>{formatDate(update_date as Date)}</Text>
        </Box>
      );
    },
    sortable: false,
  },
  {
    field: 'goods_status',
    headerName: '상태',
    valueGetter: ({ row }) => {
      return GOODS_STATUS[row.goods_status as GoodsStatus];
    },
    sortable: false,
  },
  {
    field: 'goods_view',
    headerName: '노출',
    valueGetter: ({ row }) => {
      return GOODS_VIEW[row.goods_view as GoodsView];
    },
    sortable: false,
  },
  {
    field: 'stock',
    headerName: '재고/가용',
    renderCell: ({ row }) => {
      const { a_stock_count, b_stock_count, a_rstock, b_rstock, a_stock, b_stock } = row;
      return (
        <Box>
          <Text height="20px">{`[${a_stock_count}] ${a_stock}/${a_rstock}`}</Text>
          <Text>{`[${b_stock_count}] ${b_stock}/${b_rstock}`}</Text>
        </Box>
      );
    },
    sortable: false,
  },
  {
    field: 'confirmation',
    headerName: '검수',
    renderCell: ({ row }) => {
      const { label, colorScheme } = row.confirmation
        ? GOODS_CONFIRMATION_STATUS[row.confirmation as GoodsConfirmationStatuses]
        : GOODS_CONFIRMATION_STATUS.waiting;
      return <Badge colorScheme={colorScheme}>{label}</Badge>;
    },
    sortable: false,
  },
];

export function SellerGoodsList(): JSX.Element {
  const { data: profileData } = useProfile();
  const {
    page,
    itemPerPage,
    sort,
    direction,
    changePage,
    changeItemPerPage,
    changeSort,
  } = useSellerGoodsListPanelStore();
  const { data, isLoading } = useSellerGoodsList(
    {
      page,
      itemPerPage,
      sort,
      direction,
      email: profileData?.email || '',
    },
    {
      enabled: !!profileData?.email,
    },
  );
  const handleSelection = (selectionModel: GridSelectionModel) => {
    console.log({ selectionModel });
  };
  return (
    <Box>
      <ChakraDataGrid
        loading={isLoading}
        rows={data?.items || []}
        autoHeight
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={handleSelection}
        disableColumnMenu
        paginationMode="server"
        pageSize={itemPerPage}
        rowCount={data?.totalItemCount}
        onPageChange={changePage}
      />
    </Box>
  );
}

export default SellerGoodsList;
