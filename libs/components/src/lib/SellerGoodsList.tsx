/* eslint-disable camelcase */
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Select,
  Stack,
  Text,
  Link,
  useDisclosure,
  useColorModeValue,
  UnorderedList,
  ListItem,
  Flex,
} from '@chakra-ui/react';
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
import { SellerGoodsSortColumn } from '@project-lc/shared-types';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { ChakraDataGrid } from './ChakraDataGrid';
import {
  RUNOUT_POLICY,
  GOODS_STATUS,
  GOODS_VIEW,
  GOODS_CONFIRMATION_STATUS,
} from '../constants/goodsStatus';
import { GoodsExposeSwitch } from './GoodsExposeSwitch';
import TextWithPopperButton from './TextWithPopperButton';
import StockInfoButton, { ExampleStockDescription } from './StockInfoButton';
import DeleteGoodsAlertDialog from './DeleteGoodsAlertDialog';
import { ShippingGroupDetailModal } from './GoodsRegistShippingPolicy';

function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString();
  return `${formattedPrice}원`;
}
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
}

export function ShippingGroupDetailButton(props: { id: number; name: string }) {
  const { id, name } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        data-shipping-group-id={id}
        onClick={onOpen}
        variant="link"
        fontSize="sm"
        colorScheme="black"
      >
        {name}
      </Button>
      <ShippingGroupDetailModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => {
          return Promise.resolve();
        }}
        groupId={id}
      />
    </>
  );
}

// * 상품목록 datagrid 컬럼 ***********************************************
const columns: GridColumns = [
  { field: 'id', headerName: 'ID', width: 40, sortable: false },
  {
    field: 'goods_name',
    headerName: '상품명',
    minWidth: 120,
    flex: 1,
    sortable: false,
    // TODO: 상품 상세페이지 일감 진행 후 상품 상세페이지로 이동 기능 추가
    renderCell: ({ row }) => {
      const goodsId = row.id;
      const { goods_name } = row;
      return (
        <NextLink href={`/mypage/goods/${goodsId}`} passHref>
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
    field: 'stock',
    headerName: '재고/가용',
    minWidth: 110,
    renderHeader: () => {
      return (
        <TextWithPopperButton
          title="재고/가용"
          iconAriaLabel="재고/가용 설명"
          iconColor="black"
          portalBody
        >
          <ExampleStockDescription />
        </TextWithPopperButton>
      );
    },
    renderCell: ({ row }) => {
      const { a_stock_count, b_stock_count, a_rstock, b_rstock, a_stock, b_stock } = row;
      const goodsName = row.goods_name;
      const goodsId = row.id;
      const confirmedGoodsId = row.confirmation?.firstmallGoodsConnectionId;
      return (
        <Box position="relative" width="100%">
          <Text
            height="20px"
            color="blue.500"
          >{`[${a_stock_count}] ${a_stock} / ${a_rstock}`}</Text>
          <Text color="red.500">{`[${b_stock_count}] ${b_stock} / ${b_rstock}`}</Text>
          <StockInfoButton
            goodsId={goodsId}
            confirmedGoodsId={confirmedGoodsId}
            goodsName={goodsName}
            iconColor="black"
          />
        </Box>
      );
    },
    sortable: false,
  },
  {
    field: 'runout_policy',
    headerName: '재고판매',
    align: 'center',
    valueGetter: ({ row }) => {
      return RUNOUT_POLICY[row.runout_policy as RunoutPolicy];
    },
    renderHeader: () => {
      return (
        <TextWithPopperButton
          title="재고판매"
          iconAriaLabel="재고판매 설명"
          iconColor="black"
          portalBody
        >
          <Text mb={2} fontWeight="bold">
            재고(옵션 기준)에 따른 상품 판매 설정에 따라 아래와 같이 3가지로 표기됩니다.
          </Text>
          <UnorderedList spacing={1}>
            <ListItem>재고가 있으면 판매 : 재고</ListItem>
            <ListItem>가용 재고가 있으면 판매 : 가용 재고</ListItem>
            <ListItem>재고 상관없이 주문 가능 : 무제한</ListItem>
          </UnorderedList>
        </TextWithPopperButton>
      );
    },
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
    headerName: '상태',
    minWidth: 50,
    valueGetter: ({ row }) => {
      return GOODS_STATUS[row.goods_status as GoodsStatus];
    },
    sortable: false,
  },
  {
    field: 'goods_view',
    headerName: '노출',
    width: 60,
    valueGetter: ({ row }) => {
      return GOODS_VIEW[row.goods_view as GoodsView];
    },
    renderCell: ({ row }) => {
      const goodsId = row.id;
      const goodsView = row.goods_view;
      const confirmedGoodsId = row.confirmation?.firstmallGoodsConnectionId;
      return (
        <Flex alignItems="center" justifyContent="center">
          <GoodsExposeSwitch
            goodsId={goodsId}
            goodsView={goodsView}
            confirmedGoodsId={confirmedGoodsId}
          />
        </Flex>
      );
    },
    sortable: false,
  },

  {
    field: 'confirmation',
    headerName: '검수',
    width: 60,
    renderCell: ({ row }) => {
      const { label, colorScheme } = row.confirmation
        ? GOODS_CONFIRMATION_STATUS[row.confirmation.status as GoodsConfirmationStatuses]
        : GOODS_CONFIRMATION_STATUS.waiting;
      return (
        <Badge variant="solid" colorScheme={colorScheme} width="100%" textAlign="center">
          {label}
        </Badge>
      );
    },
    sortable: false,
  },
  {
    field: 'manage',
    headerName: '관리',
    minWidth: 120,
    renderCell: ({ row }) => {
      const goodsId = row.id;
      return (
        <ButtonGroup>
          <Button size="sm" onClick={() => console.log({ goodsId })}>
            수정
          </Button>
        </ButtonGroup>
      );
    },
  },
];
// * 상품목록 datagrid 컬럼 끝*********************************************

/** DataGrid style 때문에 chakra switch 이상하게 보이는거 방지하기 위해 적용 */
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDataGrid-cell .chakra-switch': {
      boxSizing: 'unset',
    },
  },
}));

export function SellerGoodsList(): JSX.Element {
  const { root } = useStyles();
  const { data: profileData } = useProfile();
  const {
    page,
    itemPerPage,
    sort,
    direction,
    groupId,
    changePage,
    handlePageSizeChange,
    handleSortChange,
  } = useSellerGoodsListPanelStore();
  const { data, isLoading } = useSellerGoodsList(
    {
      page,
      itemPerPage,
      sort,
      direction,
      groupId,
      email: profileData?.email || '',
    },
    {
      enabled: !!profileData?.email,
    },
  );

  // 선택된 상품 id
  const [selectedGoodsIds, setSelectedGoodsIds] = useState<GridSelectionModel>([]);

  // 상품선택 핸들러
  const handleSelection = (selectionModel: GridSelectionModel) => {
    setSelectedGoodsIds(selectionModel);
  };

  // 상품삭제 시 alert 다이얼로그
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <ChakraDataGrid
        className={root}
        bg={useColorModeValue('inherit', 'gray.300')}
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
        components={{
          Toolbar: () => (
            <Stack spacing={3} direction="row" justify="space-between" p={2}>
              <Button
                disabled={selectedGoodsIds.length <= 0}
                onClick={onOpen}
                colorScheme="red"
                size="sm"
              >
                선택 삭제
              </Button>
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
            </Stack>
          ),
        }}
      />
      {/* 상품 삭제 alert */}
      <DeleteGoodsAlertDialog
        onClose={onClose}
        isOpen={isOpen}
        items={data?.items}
        selectedGoodsIds={selectedGoodsIds}
      />
    </Box>
  );
}

export default SellerGoodsList;
