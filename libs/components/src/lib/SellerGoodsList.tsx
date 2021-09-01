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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Icon,
  useDisclosure,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useDeleteFmGoods,
  useDeleteLcGoods,
  useProfile,
  useSellerGoodsList,
} from '@project-lc/hooks';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import {
  GoodsConfirmationStatuses,
  GoodsStatus,
  GoodsView,
  RunoutPolicy,
} from '@prisma/client';
import { useSellerGoodsListPanelStore } from '@project-lc/stores';
import { SortColumn, SortDirection } from '@project-lc/shared-types';
import { useRef, useState } from 'react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { useQueryClient } from 'react-query';
import { ChakraDataGrid } from './ChakraDataGrid';
import {
  RUNOUT_POLICY,
  GOODS_STATUS,
  GOODS_VIEW,
  GOODS_CONFIRMATION_STATUS,
} from '../constants/goodsStatus';
import { GoodsExposeSwitch } from './GoodsExposeSwitch';

function formatPrice(price: number): string {
  const formattedPrice = price.toLocaleString();
  return `${formattedPrice}원`;
}
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY/MM/DD HH:mm');
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
        <NextLink href={`#${goodsId}`} passHref>
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
    field: 'runout_policy',
    headerName: '재고판매',
    align: 'center',
    valueGetter: ({ row }) => {
      return RUNOUT_POLICY[row.runout_policy as RunoutPolicy];
    },
    sortable: false,
  },
  // TODO: 배송비 정책 혹은 상품 등록 진행 후 배송비 정책 연결 필요
  { field: 'shipping_policy', headerName: '배송비', sortable: false, minWidth: 80 },
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
        <GoodsExposeSwitch
          goodsId={goodsId}
          goodsView={goodsView}
          confirmedGoodsId={confirmedGoodsId}
        />
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
        <Badge variant="solid" colorScheme={colorScheme} width="100%">
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
    // TODO: 상품등록 일감 진행 후 복사, 수정기능 추가
    renderCell: ({ row }) => {
      const goodsId = row.id;
      return (
        <ButtonGroup>
          <Button size="sm" onClick={() => console.log({ goodsId })}>
            수정
          </Button>
          <Button size="sm" onClick={() => console.log({ goodsId })}>
            복사
          </Button>
        </ButtonGroup>
      );
    },
  },
];
// * 상품목록 datagrid 컬럼 끝*********************************************

export function SellerGoodsList(): JSX.Element {
  const queryClient = useQueryClient();
  const toast = useToast();
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

  // 페이지당 보여질 행 개수 변경 핸들러
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    changeItemPerPage(Number(value));
  };
  // 상품 정렬 변경 핸들러
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    switch (value) {
      case 'regist_date':
        changeSort(SortColumn.REGIST_DATE, SortDirection.DESC);
        break;
      case 'goods_name':
        changeSort(SortColumn.GOODS_NAME, SortDirection.DESC);
        break;
      default:
    }
  };

  // 선택된 상품 id
  const [selectedGoodsIds, setSelectedGoodsIds] = useState<GridSelectionModel>([]);
  const hasSelectedGoods = selectedGoodsIds.length > 0;

  // 상품선택 핸들러
  const handleSelection = (selectionModel: GridSelectionModel) => {
    setSelectedGoodsIds(selectionModel);
  };

  // 상품삭제 시 alert 다이얼로그
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Goods테이블에서 삭제요청
  const deleteLcGoods = useDeleteLcGoods();
  // fm-goods 테이블에서 삭제요청
  const deleteFmGoods = useDeleteFmGoods();

  // 삭제 다이얼로그에서 확인 눌렀을 때 상품삭제 핸들러
  const handleDelete = async () => {
    if (!data || !hasSelectedGoods) return;
    // 검수된 상품
    const confirmedGoods = data.items.filter(
      (item) =>
        selectedGoodsIds.includes(item.id) &&
        item.confirmation &&
        item.confirmation.status === 'confirmed' &&
        item.confirmation.firstmallGoodsConnectionId !== null,
    );

    try {
      // 전체 선택된 상품 Goods테이블에서 삭제요청
      const deleteGoodsFromLcDb = deleteLcGoods.mutateAsync({
        ids: selectedGoodsIds.map((id) => Number(id)),
      });
      // 선택된 상품 중 검수된 상품은 fm-goods 테이블에서 삭제요청
      const deleteGoodsFromFmDb = deleteFmGoods.mutateAsync({
        ids: confirmedGoods.map((item) => Number(item.id)),
      });
      await Promise.all([deleteGoodsFromLcDb, deleteGoodsFromFmDb]);
      queryClient.invalidateQueries('SellerGoodsList');
    } catch (error) {
      console.error(error);
      toast({
        title: '상품 삭제 중 오류가 발생하였습니다',
        status: 'error',
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

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
              <Button onClick={onOpen} colorScheme="red" size="sm">
                선택 삭제
              </Button>
              <Stack direction="row">
                <Select
                  defaultValue={10}
                  onChange={handlePageSizeChange}
                  width="150px"
                  size="sm"
                >
                  <option value={10}>10개씩</option>
                  <option value={20}>20개씩</option>
                  <option value={30}>30개씩</option>
                </Select>
                <Select
                  defaultValue={SortColumn.REGIST_DATE}
                  onChange={handleSortChange}
                  width="150px"
                  size="sm"
                >
                  <option value={SortColumn.REGIST_DATE}>최근 등록 순</option>
                  <option value={SortColumn.GOODS_NAME}>상품명 순</option>
                </Select>
              </Stack>
            </Stack>
          ),
        }}
      />
      {/* 상품 삭제 alert */}
      <AlertDialog
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Text>
                <Icon as={WarningTwoIcon} color="red.500" mr={2} />
                상품 삭제
              </Text>
            </AlertDialogHeader>

            <AlertDialogBody>
              {!hasSelectedGoods
                ? '삭제할 상품을 선택해주세요'
                : '상품 삭제시 복구가 불가합니다. 선택한 상품을 삭제하시겠습니까?'}
            </AlertDialogBody>

            <AlertDialogFooter>
              {hasSelectedGoods && <Button onClick={onClose}>취소</Button>}
              <Button
                onClick={!hasSelectedGoods ? onClose : handleDelete}
                ml={3}
                colorScheme={!hasSelectedGoods ? undefined : 'red'}
                isLoading={deleteLcGoods.isLoading || deleteFmGoods.isLoading}
              >
                확인
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default SellerGoodsList;
