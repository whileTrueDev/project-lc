import { RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Link,
  Select,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import { GoodsConfirmationStatuses, GoodsStatus } from '@prisma/client';
import {
  GOODS_CONFIRMATION_STATUS,
  GOODS_STATUS,
} from '@project-lc/components-constants/goodsStatus';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { ShippingGroupDetailButton } from '@project-lc/components-seller/SellerGoodsList';
import { useAdminGoodsList, useProfile } from '@project-lc/hooks';
import {
  AdminGoodsData,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { ConfirmationBadge } from './AdminBusinessRegistrationList';
import AdminDatagridWrapper, {
  NOT_CHECKED_BY_ADMIN_CLASS_NAME,
} from './AdminDatagridWrapper';
import { AdminGoodsConfirmationDialog } from './AdminGoodsConfirmationDialog';
import AdminGoodsRejectionDialog from './AdminGoodsRejectionDialog';

function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
}
type UniqueSellerType = {
  sellerId: number;
  sellerName: string;
};
type AdminGoodsConfirmListData = {
  isLoading: boolean;
  refetch: () => Promise<any>;
  uniqueSellerList: UniqueSellerType[];
  rows: AdminGoodsData[];
  rowCount: number | undefined;
  filterSellerId: number | null;
  setFilterSellerId: Dispatch<SetStateAction<number | null>>;
};

// * 관리자 상품검수 목록 데이터 처리 로직 분리
function useAdminGoodsConfirmList({
  sort,
  direction,
}: {
  sort: SellerGoodsSortColumn;
  direction: SellerGoodsSortDirection;
}): AdminGoodsConfirmListData {
  const { data: profileData } = useProfile();
  const { data, isLoading, refetch } = useAdminGoodsList(
    { sort, direction },
    { enabled: !!profileData?.id },
  );
  // 판매자 목록 - 상품의 판매자와 고유번호만 추려내서 필터로 사용
  const sellerList = !data
    ? []
    : data.items.map((g) => ({ sellerId: g.sellerId, sellerName: g.name }));

  // 판매자목록 중복 제거
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

  // 선택된 판매자 id
  const [filterSellerId, setFilterSellerId] = useState<null | number>(null);

  // 선택된 판매자 id로 필터링 된 상품검수목록
  const rows = useMemo(() => {
    if (!data?.items) return [];
    if (filterSellerId) {
      return data.items.filter((i) => i.sellerId === filterSellerId);
    }
    return data.items;
  }, [data, filterSellerId]);

  // 선택된 판매자 id로 필터링 된 상품검수목록 길이
  const rowCount = useMemo(() => {
    if (filterSellerId) {
      return data?.items.filter((i) => i.sellerId === filterSellerId).length;
    }
    return data?.totalItemCount;
  }, [data, filterSellerId]);

  return {
    isLoading,
    refetch,
    uniqueSellerList,
    rows,
    rowCount,
    filterSellerId,
    setFilterSellerId,
  };
}

// * 관리자 상품검수목록 필터링 위한 판매자 select 컴포넌트
function SellerFilterSelect({
  uniqueSellerList,
  filterSellerId,
  setFilterSellerId,
}: Pick<
  AdminGoodsConfirmListData,
  'uniqueSellerList' | 'filterSellerId' | 'setFilterSellerId'
>): JSX.Element {
  const ALL_VALUE = '전체';
  const ALL_OPTION_LABEL = '-- 모든 판매자 --';
  const selectValue = filterSellerId ? filterSellerId.toString() : ALL_VALUE;
  return (
    <Stack direction="row" alignItems="center">
      <Text width="200px" textAlign="right">
        판매자별 보기
      </Text>
      <Select
        size="sm"
        value={selectValue}
        onChange={(e) => {
          // value는 sellerId 값을 전달함
          const { value } = e.target;
          // value 값이 '전체' 인경우 => 필터해제. sellerId 값이 있는 경우 => 해당 아이디로 item 필터
          if (value === ALL_VALUE) {
            setFilterSellerId(null);
          } else {
            setFilterSellerId(Number(value));
          }
        }}
      >
        <option value={ALL_VALUE}>{ALL_OPTION_LABEL}</option>
        {uniqueSellerList.map((us) => {
          return (
            <option value={us.sellerId} key={us.sellerId}>
              {us.sellerName} {`(${us.sellerId})`}
            </option>
          );
        })}
      </Select>
    </Stack>
  );
}

// * 상품 검수를 위한 미승인 상품 목록
export function AdminGoodsList(): JSX.Element {
  const confirmDialog = useDisclosure();
  const rejectionDialog = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<null | AdminGoodsData>(null);

  const handleConfirmClick = useCallback(
    (data: AdminGoodsData): void => {
      setSelectedRow(data);
      confirmDialog.onOpen();
    },
    [confirmDialog],
  );
  const handleRejectClick = useCallback(
    (data: AdminGoodsData): void => {
      setSelectedRow(data);
      rejectionDialog.onOpen();
    },
    [rejectionDialog],
  );

  // * 상품목록 datagrid 컬럼 ***********************************************
  const columns: GridColumns = useMemo(
    () => [
      {
        field: 'confirmation.status',
        headerName: '검수승인/반려',
        valueGetter: ({ row }) => row.confirmation.status,
        width: 140,
        renderCell: ({ row }) => {
          const confirmStatus = row.confirmation.status as GoodsConfirmationStatuses;
          const _row = row as AdminGoodsData;
          if (_row.confirmation.status === 'confirmed') {
            return <Text>{GOODS_CONFIRMATION_STATUS[confirmStatus].label}</Text>;
          }
          return (
            <Flex gap={2}>
              <Text color="red.500" fontWeight="bold">
                {GOODS_CONFIRMATION_STATUS[confirmStatus].label}
              </Text>
              <Stack spacing={0.5}>
                <Button
                  colorScheme="green"
                  size="xs"
                  onClick={() => handleConfirmClick(_row)}
                >
                  승인하기
                </Button>
                <Button
                  colorScheme="red"
                  size="xs"
                  onClick={() => handleRejectClick(_row)}
                >
                  반려하기
                </Button>
              </Stack>
            </Flex>
          );
        },
      },
      {
        field: 'goods_status',
        headerName: '상태',
        width: 60,
        valueGetter: ({ row }) => {
          return GOODS_STATUS[row.goods_status as GoodsStatus];
        },
        sortable: false,
      },
      {
        field: 'businessRegistrationStatus',
        headerName: '사업자정보',
        minWidth: 120,
        renderCell: (params) => (
          <Flex lineHeight={1.5}>
            <ConfirmationBadge status={params.row.businessRegistrationStatus} />
          </Flex>
        ),
      },
      {
        field: 'name',
        headerName: '판매자명(고유번호)',
        minWidth: 140,
        sortable: false,
        valueGetter: ({ row }) => `${row.name} (${row.sellerId})`,
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
            <Flex justify="flex-start">
              <NextLink href={`/goods/${goodsId}`} passHref>
                <Link>
                  <Text isTruncated>{goods_name}</Text>
                </Link>
              </NextLink>
            </Flex>
          );
        },
      },
      {
        field: 'default_price',
        headerName: '판매가',
        type: 'number',
        valueFormatter: ({ row }) => `${getLocaleNumber(row.default_price)}원`,
        sortable: false,
      },
      {
        field: 'default_consumer_price',
        headerName: '정가',
        type: 'number',
        valueFormatter: ({ row }) => `${getLocaleNumber(row.default_consumer_price)}원`,
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
    ],
    [handleConfirmClick, handleRejectClick],
  );
  // * 상품목록 datagrid 컬럼 끝*********************************************

  const {
    itemPerPage,
    sort,
    direction,
    changePage,
    handlePageSizeChange,
    handleSortChange,
  } = useSellerGoodsListPanelStore();
  const {
    isLoading,
    refetch,
    rows,
    rowCount,
    uniqueSellerList,
    filterSellerId,
    setFilterSellerId,
  } = useAdminGoodsConfirmList({ sort, direction });

  return (
    <AdminDatagridWrapper>
      <ChakraDataGrid
        loading={isLoading}
        rows={rows}
        getRowClassName={(params) => {
          if (
            params.row.confirmation?.status === 'waiting' ||
            params.row.confirmation?.status === 'needReconfirmation'
          ) {
            return NOT_CHECKED_BY_ADMIN_CLASS_NAME;
          }
          return '';
        }}
        autoHeight
        columns={columns}
        disableSelectionOnClick
        disableColumnMenu
        pageSize={itemPerPage}
        rowCount={rowCount}
        onPageChange={changePage}
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
                <SellerFilterSelect
                  uniqueSellerList={uniqueSellerList}
                  filterSellerId={filterSellerId}
                  setFilterSellerId={setFilterSellerId}
                />
              </Stack>
              <Button
                isLoading={isLoading}
                size="xs"
                leftIcon={<RepeatIcon />}
                onClick={() => refetch()}
              >
                새로고침
              </Button>
            </Stack>
          ),
        }}
      />
      <AdminGoodsConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.onClose}
        row={selectedRow}
        callback={() => {
          refetch();
        }}
      />
      <AdminGoodsRejectionDialog
        isOpen={rejectionDialog.isOpen}
        onClose={rejectionDialog.onClose}
        row={selectedRow}
      />
    </AdminDatagridWrapper>
  );
}

export default AdminGoodsList;
