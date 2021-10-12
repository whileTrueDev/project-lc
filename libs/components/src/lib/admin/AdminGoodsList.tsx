import {
  Box,
  Button,
  Link,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { GridCellParams, GridColumns } from '@material-ui/data-grid';
import { GoodsConfirmationStatuses, GoodsStatus } from '@prisma/client';
import { useAdminGoodsList, useProfile } from '@project-lc/hooks';
import { SellerGoodsSortColumn } from '@project-lc/shared-types';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useState } from 'react';
import { GOODS_CONFIRMATION_STATUS, GOODS_STATUS } from '../../constants/goodsStatus';
import { ChakraDataGrid } from '../ChakraDataGrid';
import { ShippingGroupDetailButton } from '../SellerGoodsList';
import { AdminGoodsConfirmationDialog } from './AdminGoodsConfirmationDialog';
import AdminGoodsRejectionDialog from './AdminGoodsRejectionDialog';

function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString();
  return `${formattedPrice}원`;
}

function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
}

// * 상품목록 datagrid 컬럼 ***********************************************
const columns: GridColumns = [
  { field: 'sellerId', headerName: '판매자 ID', minWidth: 110, sortable: false },
  {
    field: 'goods_name',
    headerName: '상품명',
    minWidth: 120,
    flex: 1,
    sortable: false,
    renderCell: ({ row }) => {
      const goodsId = row.id;
      const { goods_name } = row;
      return (
        <NextLink href={`/goods/${goodsId}`} passHref>
          <Link width="100%">
            <Text isTruncated>{goods_name}</Text>
          </Link>
        </NextLink>
      );
    },
  },
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
    field: 'shippingGroup',
    headerName: '배송비',
    sortable: false,
    minWidth: 80,
    renderCell: ({ row }) => {
      const { shippingGroup } = row;
      if (!shippingGroup) {
        return null;
      }
      const { id, shipping_group_name } = shippingGroup;
      return <ShippingGroupDetailButton id={id} name={shipping_group_name} />;
    },
  },
  {
    field: 'date',
    headerName: '등록일/수정일',
    minWidth: 150,
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
    headerName: '상품상태',
    minWidth: 50,
    valueGetter: ({ row }) => {
      return GOODS_STATUS[row.goods_status as GoodsStatus];
    },
    sortable: false,
  },
  {
    field: 'confirm_status',
    headerName: '검수상태',
    minWidth: 50,
    renderCell: ({ row }) => {
      const confirmStatus = row.confirmation.status as GoodsConfirmationStatuses;
      return <Text>{GOODS_CONFIRMATION_STATUS[confirmStatus].label}</Text>;
    },
    sortable: false,
  },
  {
    field: 'confirmation',
    headerName: '검수승인',
    width: 100,
    renderCell: () => <Button size="xs">승인하기</Button>,
    sortable: false,
  },
  {
    field: 'rejection',
    headerName: '검수반려',
    width: 100,
    renderCell: () => <Button size="xs">반려하기</Button>,
    sortable: false,
  },
];
// * 상품목록 datagrid 컬럼 끝*********************************************

export function AdminGoodsList(): JSX.Element {
  const { data: profileData } = useProfile();
  const {
    itemPerPage,
    sort,
    direction,
    changePage,
    handlePageSizeChange,
    handleSortChange,
  } = useSellerGoodsListPanelStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRejectionOpen,
    onOpen: onRejectionOpen,
    onClose: onRejectionClose,
  } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState({});
  const { data, isLoading, refetch } = useAdminGoodsList(
    {
      sort,
      direction,
    },
    {
      enabled: !!profileData?.email,
    },
  );

  async function handleClick(param: GridCellParams): Promise<void> {
    if (param.field === 'confirmation') {
      setSelectedRow(param.row);
      onOpen();
    }
    if (param.field === 'rejection') {
      setSelectedRow(param.row);
      onRejectionOpen();
    }
    // 이외의 클릭에 대해서는 다른 패널에 대해서 상세보기로 이동시키기
  }

  return (
    <Box>
      <ChakraDataGrid
        bg={useColorModeValue('inherit', 'gray.300')}
        loading={isLoading}
        rows={data?.items || []}
        autoHeight
        columns={columns}
        disableMultipleSelection
        disableSelectionOnClick
        disableColumnMenu
        paginationMode="server"
        pageSize={itemPerPage}
        rowCount={data?.totalItemCount}
        onPageChange={changePage}
        onCellClick={handleClick}
        components={{
          Toolbar: () => (
            <Stack
              spacing={3}
              direction="row"
              justify="space-between"
              p={2}
              alignItems="center"
            >
              <Stack direction="row">
                <Select value={itemPerPage} onChange={handlePageSizeChange} size="sm">
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                </Select>
                <Select value={sort} onChange={handleSortChange} size="sm">
                  <option value={SellerGoodsSortColumn.REGIST_DATE}>최근 등록 순</option>
                  <option value={SellerGoodsSortColumn.GOODS_NAME}>상품명 순</option>
                </Select>
              </Stack>
              <Button
                size="xs"
                onClick={() => {
                  refetch();
                }}
              >
                새로고침
              </Button>
            </Stack>
          ),
        }}
      />
      <AdminGoodsConfirmationDialog
        isOpen={isOpen}
        onClose={onClose}
        row={selectedRow}
        callback={() => {
          refetch();
        }}
      />
      <AdminGoodsRejectionDialog
        isOpen={isRejectionOpen}
        onClose={onRejectionClose}
        row={selectedRow}
      />
    </Box>
  );
}

export default AdminGoodsList;
