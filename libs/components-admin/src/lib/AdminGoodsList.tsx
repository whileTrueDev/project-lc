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
import {
  GOODS_CONFIRMATION_STATUS,
  GOODS_STATUS,
} from '@project-lc/components-constants/goodsStatus';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { ShippingGroupDetailButton } from '@project-lc/components-seller/SellerGoodsList';
import { useAdminGoodsList, useDisplaySize, useProfile } from '@project-lc/hooks';
import { SellerGoodsSortColumn } from '@project-lc/shared-types';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { ConfirmationBadge } from './AdminBusinessRegistrationList';
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
    field: 'businessRegistrationStatus',
    headerName: '사업자등록정보검수상태',
    minWidth: 200,
    renderCell: (params) => (
      <ConfirmationBadge status={params.row.businessRegistrationStatus} />
    ),
  },
  {
    field: 'name',
    headerName: '판매자명',
    minWidth: 110,
    sortable: false,
    valueGetter: ({ row }) => row.name,
  },
  {
    field: 'goods_name',
    headerName: '상품명',
    minWidth: 500,
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
];
// * 상품목록 datagrid 컬럼 끝*********************************************

export function AdminGoodsList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { isDesktopSize } = useDisplaySize();
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
      enabled: !!profileData?.id,
    },
  );
  const handleClick = async (param: GridCellParams): Promise<void> => {
    if (param.field === 'confirmation') {
      setSelectedRow(param.row);
      onOpen();
    }
    if (param.field === 'rejection') {
      setSelectedRow(param.row);
      onRejectionOpen();
    }
    // 이외의 클릭에 대해서는 다른 패널에 대해서 상세보기로 이동시키기
  };

  // 상품의 판매자와 고유번호만 추려내서 필터로 쓰기
  const sellerList = !data
    ? []
    : data.items.map((g) => ({ sellerId: g.sellerId, sellerName: g.name }));

  const uniqueSellerList = sellerList.reduce((unique, i) => {
    if (
      unique.findIndex(
        (u) => u.sellerId === i.sellerId && u.sellerName === i.sellerName,
      ) > -1
    ) {
      return unique;
    }
    return [...unique, i];
  }, [] as Array<{ sellerId: number; sellerName: string }>);

  const [filterSellerId, setFilterSellerId] = useState<null | number>(null);

  const rows = useMemo(() => {
    if (!data?.items) return [];
    if (filterSellerId) {
      return data.items.filter((i) => i.sellerId === filterSellerId);
    }
    return data.items;
  }, [data, filterSellerId]);

  const rowCount = useMemo(() => {
    if (filterSellerId) {
      return data?.items.filter((i) => i.sellerId === filterSellerId).length;
    }
    return data?.totalItemCount;
  }, [data, filterSellerId]);
  return (
    <>
      <ChakraDataGrid
        bg={useColorModeValue('inherit', 'gray.300')}
        loading={isLoading}
        rows={rows}
        autoHeight
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        disableMultipleSelection
        disableSelectionOnClick
        disableColumnMenu
        paginationMode="server"
        pageSize={itemPerPage}
        rowCount={rowCount}
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
                <Text width="200px">판매자별 보기</Text>
                <Select
                  size="sm"
                  value={filterSellerId  ? filterSellerId.toString() : '전체'}
                  onChange={(e) => {
                    // sellerId 값을 전달함
                    const { value } = e.target;
                    // '전체' 인경우 => 필터해제
                    if (value === '전체') {
                      setFilterSellerId(null);
                    } else {
                      // sellerId 값이 경우 => 해당 아이디로 item 필터
                      setFilterSellerId(Number(value));
                    }
                  }}
                >
                  <option value={'전체'}>-- 모든 판매자 --</option>
                  {uniqueSellerList.map((us) => {
                    return (
                      <option value={us.sellerId} key={us.sellerId}>
                        {us.sellerName}
                      </option>
                    );
                  })}
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
    </>
  );
}

export default AdminGoodsList;
