import {
  Badge,
  Box,
  Button,
  Flex,
  Link,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import { GoodsConfirmationStatuses, GoodsStatus, GoodsView } from '@prisma/client';
import { useProfile, useSellerGoodsList } from '@project-lc/hooks';
import { SellerGoodsSortColumn } from '@project-lc/shared-types';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useState } from 'react';
import {
  GOODS_CONFIRMATION_STATUS,
  GOODS_STATUS,
  GOODS_VIEW,
} from '../constants/goodsStatus';
import { ChakraDataGrid } from './ChakraDataGrid';
import DeleteGoodsAlertDialog from './DeleteGoodsAlertDialog';
import { GoodsExposeSwitch } from './GoodsExposeSwitch';
import { ShippingGroupDetailModal } from './GoodsRegistShippingPolicy';
import TextWithPopperButton from './TextWithPopperButton';

function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString();
  return `${formattedPrice}원`;
}
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
}

/** 라이브쇼핑 진행중이므로 수정 불가 표시 */
export function GoodsEditDisabledText(): JSX.Element {
  return (
    <TextWithPopperButton
      title="수정불가"
      iconAriaLabel="수정불가"
      iconColor="black"
      portalBody
    >
      <Text>
        현재 라이브 쇼핑이 진행중인 상품으로 상품 정보를 변경할 수 없습니다. <br />
        상품 정보를 수정하고 싶은 경우 고객센터로 문의해주세요.
      </Text>
    </TextWithPopperButton>
  );
}

/** 배송비 그룹 상세정보 조회 버튼 */
export function ShippingGroupDetailButton(props: {
  id: number;
  name: string;
}): JSX.Element {
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

/** 상품 수정 페이지로 이동하는 링크 */
export function GoodsEditButton({
  goodsId,
  onLiveShopping = false,
}: {
  goodsId: number | string;
  onLiveShopping?: boolean;
}): JSX.Element {
  // 라이브쇼핑 진행중인 상품의 경우
  if (onLiveShopping) return <GoodsEditDisabledText />;
  return (
    <NextLink href={`/mypage/goods/edit/${goodsId}`} passHref>
      <Link>
        <Text
          borderWidth="1px"
          borderRadius="md"
          textAlign="center"
          lineHeight="1.2"
          fontWeight="semibold"
          fontSize="sm"
          height={8}
          p={2}
        >
          수정하기
        </Text>
      </Link>
    </NextLink>
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
  /* [상품 옵션] 재고 기능 임시 제거 */
  // {
  //   field: 'stock',
  //   headerName: '재고/가용',
  //   minWidth: 110,
  //   renderHeader: () => {
  //     return (
  //       <TextWithPopperButton
  //         title="재고/가용"
  //         iconAriaLabel="재고/가용 설명"
  //         iconColor="black"
  //         portalBody
  //       >
  //         <ExampleStockDescription />
  //       </TextWithPopperButton>
  //     );
  //   },
  //   renderCell: ({ row }) => {
  //     const { a_stock_count, b_stock_count, a_rstock, b_rstock, a_stock, b_stock } = row;
  //     const goodsName = row.goods_name;
  //     const goodsId = row.id;
  //     const confirmedGoodsId = row.confirmation?.firstmallGoodsConnectionId;
  //     return (
  //       <Box position="relative" width="100%">
  //         <Text
  //           height="20px"
  //           color="blue.500"
  //         >{`[${a_stock_count}] ${a_stock} / ${a_rstock}`}</Text>
  //         <Text color="red.500">{`[${b_stock_count}] ${b_stock} / ${b_rstock}`}</Text>
  //         <StockInfoButton
  //           goodsId={goodsId}
  //           confirmedGoodsId={confirmedGoodsId}
  //           goodsName={goodsName}
  //           iconColor="black"
  //         />
  //       </Box>
  //     );
  //   },
  //   sortable: false,
  // },
  // {
  //   field: 'runout_policy',
  //   headerName: '재고판매',
  //   align: 'center',
  //   valueGetter: ({ row }) => {
  //     return RUNOUT_POLICY[row.runout_policy as RunoutPolicy];
  //   },
  //   renderHeader: () => {
  //     return (
  //       <TextWithPopperButton
  //         title="재고판매"
  //         iconAriaLabel="재고판매 설명"
  //         iconColor="black"
  //         portalBody
  //       >
  //         <Text mb={2} fontWeight="bold">
  //           재고(옵션 기준)에 따른 상품 판매 설정에 따라 아래와 같이 3가지로 표기됩니다.
  //         </Text>
  //         <UnorderedList spacing={1}>
  //           <ListItem>재고가 있으면 판매 : 재고</ListItem>
  //           <ListItem>가용 재고가 있으면 판매 : 가용 재고</ListItem>
  //           <ListItem>재고 상관없이 주문 가능 : 무제한</ListItem>
  //         </UnorderedList>
  //       </TextWithPopperButton>
  //     );
  //   },
  //   sortable: false,
  // },
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
      const goodsOnLiveShopping = row.onLiveShopping; // 라이브쇼핑 진행중인 경우 노출 변경 불가하도록
      return (
        <Flex alignItems="center" justifyContent="center">
          <GoodsExposeSwitch
            goodsId={goodsId}
            goodsView={goodsView}
            confirmedGoodsId={confirmedGoodsId}
            isReadOnly={goodsOnLiveShopping}
          />
        </Flex>
      );
    },
    sortable: false,
  },

  {
    field: 'confirmation',
    headerName: '검수',
    width: 90,
    renderCell: ({ row }) => {
      const {
        status,
        rejectionReason,
      }: { status: GoodsConfirmationStatuses; rejectionReason?: string | null } =
        row.confirmation;
      const { label, colorScheme } =
        GOODS_CONFIRMATION_STATUS[status as GoodsConfirmationStatuses];

      // 검수 상태 : 반려된 경우
      // 상태 옆에 '?' 버튼 추가, 해당 버튼 눌렀을 때 반려사유 팝오버
      if (status === 'rejected') {
        return (
          <TextWithPopperButton
            title={
              <Badge
                lineHeight="1.5"
                variant="solid"
                colorScheme={colorScheme}
                width="100%"
                textAlign="center"
              >
                {label}
              </Badge>
            }
            iconAriaLabel={label}
            iconColor="black"
            portalBody
          >
            <Text fontWeight="bold" mb={1}>
              반려 사유
            </Text>
            <Text whiteSpace="break-spaces">{rejectionReason}</Text>
          </TextWithPopperButton>
        );
      }
      // 검수 상태 : 대기, 승인의 경우
      return (
        <Badge
          lineHeight="1.5"
          variant="solid"
          colorScheme={colorScheme}
          width="100%"
          textAlign="center"
        >
          {label}
        </Badge>
      );
    },
    sortable: false,
  },
  {
    field: 'manage',
    headerName: '관리',
    minWidth: 60,
    renderCell: ({ row }) => {
      const goodsId = row.id;
      const goodsOnLiveShopping = row.onLiveShopping;
      return <GoodsEditButton goodsId={goodsId} onLiveShopping={goodsOnLiveShopping} />;
    },
  },
];
// * 상품목록 datagrid 컬럼 끝*********************************************

export function SellerGoodsList(): JSX.Element {
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
  const handleSelection = (selectionModel: GridSelectionModel): void => {
    setSelectedGoodsIds(selectionModel);
  };

  // 상품삭제 시 alert 다이얼로그
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <ChakraDataGrid
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
