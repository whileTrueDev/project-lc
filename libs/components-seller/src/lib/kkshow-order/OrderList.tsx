import { DownloadIcon, Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Link,
  Stack,
  Text,
  Tooltip,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import {
  GridColumns,
  GridRowId,
  GridToolbarContainer,
  GridRowData,
} from '@material-ui/data-grid';
import { OrderItemOption, ProcessStatus } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { TooltipedText } from '@project-lc/components-core/TooltipedText';
import { useDisplaySize, useProfile, useSellerOrderList } from '@project-lc/hooks';
import {
  isOrderExportable,
  OrderDataWithRelations,
  OrderItemWithRelations,
  orderProcessStepDict,
} from '@project-lc/shared-types';
import { useSellerOrderStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaTruck } from 'react-icons/fa';
import { KkshowOrderStatusBadge } from '../KkshowOrderStatusBadge';
import ExportManyDialog from '../ExportManyDialog';
import OrderListDownloadDialog from './OrderListDownloadDialog';

const columns: GridColumns = [
  {
    field: 'orderCode',
    headerName: '주문번호',
    width: 140,
    renderCell: (params) => {
      return (
        <NextLink href={`/mypage/orders/${params.row.orderCode}`} passHref>
          <Link color="blue.500" textDecoration="underline" isTruncated>
            {params.row.orderCode}
          </Link>
        </NextLink>
      );
    },
  },
  {
    field: 'createDate',
    headerName: '주문일시',
    width: 170,
    renderCell: (params) => {
      const date = dayjs(params.row.createDate).format('YYYY/MM/DD HH:mm:ss');
      return <TooltipedText text={date} />;
    },
  },
  {
    field: 'goods_name',
    headerName: '상품',
    width: 220,
    renderCell: (params) => (
      <Text>
        {params.row.orderItems
          .map((oi: OrderItemWithRelations) => oi.goods.goods_name)
          .join(', ')}
      </Text>
    ),
  },
  {
    field: 'totalEa',
    headerName: '수량(종류)',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    width: 120,
    renderCell: (params) => {
      const totalType = params.row.orderItems.length;
      const totalEa = params.row.orderItems
        .flatMap((oi: OrderItemWithRelations) => oi.options)
        .reduce((sum: number, cur: OrderItemOption) => sum + cur.quantity, 0);
      return (
        <Text>
          {totalEa}({totalType})
        </Text>
      );
    },
  },
  {
    field: 'only-web_recipient_user_name',
    headerName: '주문자/받는분',
    width: 120,
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    disableExport: true,
    renderCell: (params) => (
      <Text>
        {params.row.recipientName}
        {params.row.ordererName ? `/${params.row.ordererName}` : ''}
      </Text>
    ),
  },
  {
    field: 'totalPrice',
    headerName: '주문금액',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    width: 120,
    renderCell: (params) => {
      const totalPrice = params.row.orderItems
        .flatMap((oi: OrderItemWithRelations) => oi.options)
        .reduce(
          (sum: number, cur: OrderItemOption) =>
            sum + Number(cur.discountPrice) * Number(cur.quantity), // 주문금액 += (할인가 * 주문상품개수)
          0,
        );
      const text = `${getLocaleNumber(totalPrice)}원`;
      return <TooltipedText text={text} />;
    },
  },
  {
    field: 'step',
    headerName: '주문상태',
    disableColumnMenu: true,
    disableReorder: true,
    width: 120,
    renderCell: ({ row }) => (
      <Box lineHeight={2}>{OrderStatusBadge(row as OrderDataWithRelations)}</Box>
    ),
  },
];

function OrderStatusBadge(row: OrderDataWithRelations): JSX.Element {
  // 환불/재배송(=반품/교환), 혹은 주문취소 요청이 있는경우
  // 요청이 완료되었음에도 '취소요청' 등으로 표시되는 문제가 있어서
  // 해당 요청이 모두 완료되지 않은 경우에만 해당 요청 상태로 표시하도록 수정하였습니다
  if (
    row.returns &&
    row.returns.length > 0 &&
    !row.returns.every((r) => r.status === ProcessStatus.complete)
  ) {
    return <KkshowOrderStatusBadge orderStatus="returns" />;
  }
  // 환불은 주문취소, 환불/재배송요청(=반품/교환요청)의 결과로 생기는 데이터입니다
  // refunds가 존재한다 === (주문취소에 대한 환불처리가 완료되었음 || 환불(=반품) 요청에 대한 환불처리가 완료되었음)을 의미
  // refunds가 존재한다 !== 환불요청이 존재한다
  // if (row.refunds.length) {
  //   return <KkshowOrderStatusBadge orderStatus="refunds" />;
  // }
  if (
    row.exchanges &&
    row.exchanges.length > 0 &&
    !row.exchanges.every((e) => e.status === ProcessStatus.complete)
  ) {
    return <KkshowOrderStatusBadge orderStatus="exchanges" />;
  }
  if (
    row.orderCancellations &&
    row.orderCancellations.length > 0 &&
    !row.orderCancellations.every((c) => c.status === ProcessStatus.complete)
  ) {
    return <KkshowOrderStatusBadge orderStatus="orderCancellations" />;
  }
  return <KkshowOrderStatusBadge orderStatus={row.step} />;
}

export function OrderList(): JSX.Element {
  // 페이지당 행 select
  const rowsPerPageOptions = useRef<number[]>([10, 20, 50, 100]);
  const mapPageToNextCursor = useRef<{ [page: number]: GridRowId }>({});
  // 페이지당 행 기본 100개
  const [pageSize, setPageSize] = useState(100);
  // 페이지
  const [page, setPage] = useState(0);

  const exportManyDialog = useDisclosure();
  const sellerOrderStates = useSellerOrderStore();

  // 판매자의 주문목록 조회위해 sellerId 필요
  const { data: profileData } = useProfile();

  const sellerOrderListDto = useMemo(() => {
    const {
      search,
      searchDateType,
      periodStart,
      periodEnd,
      searchStatuses,
      searchExtendedStatus,
    } = sellerOrderStates;

    return {
      search,
      searchDateType,
      periodStart,
      periodEnd,
      searchStatuses,
      searchExtendedStatus,
      sellerId: profileData?.id,
      take: pageSize,
      skip: pageSize * page,
    };
  }, [page, pageSize, profileData?.id, sellerOrderStates]);
  const orders = useSellerOrderList(sellerOrderListDto);
  const { isDesktopSize } = useDisplaySize();

  const isExportable = useMemo(() => {
    if (!orders.data?.orders) return false;
    const _so = orders.data.orders.filter((o) =>
      sellerOrderStates.selectedOrders.includes(o.id),
    );
    return (
      _so.filter((so) => isOrderExportable(orderProcessStepDict[so.step])).length > 0
    );
  }, [sellerOrderStates.selectedOrders, orders.data]);

  const filteredOrders = useMemo(() => {
    if (!orders.data?.orders) return [];
    // 선물주문의 경우 주소가 방송인의 주소로 전달되므로 filter 필요없음
    return orders.data.orders;
  }, [orders.data]);

  const handlePageChange = (newPage: number): void => {
    if (newPage === 0 || mapPageToNextCursor.current[newPage - 1]) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (!orders.isLoading && orders.data?.nextCursor) {
      // 다음페이지 존재하는 경우 page에 해당하는 인덱스에 skip의 값을 저장해둠
      mapPageToNextCursor.current[page] = orders.data.nextCursor;
    }
  }, [orders.data, orders.isLoading, page]);

  // mui datagrid serverside 페이지네이션 참고 https://github.com/mui/mui-x/blob/v5.11.1/docs/data/data-grid/pagination/CursorPaginationGrid.tsx
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(orders.data?.count || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      orders.data?.count ? orders.data.count : prevRowCountState,
    );
  }, [orders.data, setRowCountState]);
  return (
    <Box minHeight={{ base: 300, md: 600 }} mb={24}>
      <ChakraDataGrid
        autoHeight
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={rowsPerPageOptions.current}
        pagination
        rowCount={rowCountState}
        paginationMode="server"
        onPageChange={handlePageChange}
        page={page}
        disableSelectionOnClick
        disableColumnMenu
        loading={orders.isLoading}
        columns={columns.map((col) => {
          if (col.headerName === '상품') {
            const flex = isDesktopSize ? 1 : undefined;
            return { ...col, flex };
          }
          return col;
        })}
        rows={filteredOrders}
        checkboxSelection
        selectionModel={sellerOrderStates.selectedOrders}
        onSelectionModelChange={sellerOrderStates.handleOrderSelected}
        components={{
          Toolbar: () => (
            <OrderToolbar
              options={[
                {
                  name: '출고 처리',
                  onClick: () => exportManyDialog.onOpen(),
                  icon: <Icon as={FaTruck} />,
                  emphasize: true,
                  isDisabled: !isExportable,
                  disableMessage: '출고가능한 주문이 없습니다.',
                },
              ]}
            />
          ),
          ExportIcon: DownloadIcon,
        }}
      />
      {exportManyDialog.isOpen && orders.data?.orders && (
        <ExportManyDialog
          isOpen={exportManyDialog.isOpen}
          onClose={exportManyDialog.onClose}
          orders={orders.data?.orders}
        />
      )}
    </Box>
  );
}

interface OrderToolbarProps {
  options: {
    name: string;
    onClick: (items: GridRowId[]) => void;
    icon: React.ReactElement;
    emphasize?: boolean;
    isDisabled?: boolean;
    disableMessage?: string;
  }[];
}
export function OrderToolbar({ options }: OrderToolbarProps): JSX.Element {
  const orderDownloadDialog = useDisclosure();
  const xSize = useBreakpoint();
  const isMobile = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);

  const selectedOrders = useSellerOrderStore((state) => state.selectedOrders);

  return (
    <GridToolbarContainer>
      <Stack spacing={2} direction="row" pb={2}>
        {isMobile ? null : (
          <>
            {options.map((opt) => (
              <Tooltip
                key={opt.name}
                label={opt.disableMessage}
                placement="top-start"
                isDisabled={!opt.isDisabled}
              >
                <Box>
                  <Button
                    key={opt.name}
                    size="sm"
                    rightIcon={opt.icon}
                    colorScheme={opt.emphasize ? 'pink' : undefined}
                    isDisabled={selectedOrders.length === 0 || opt.isDisabled}
                    onClick={() => opt.onClick(selectedOrders)}
                  >
                    {opt.name}
                  </Button>
                </Box>
              </Tooltip>
            ))}
            <Button
              size="sm"
              isDisabled={selectedOrders.length === 0}
              rightIcon={<DownloadIcon />}
              onClick={orderDownloadDialog.onOpen}
            >
              내보내기
            </Button>

            {orderDownloadDialog.isOpen && (
              <OrderListDownloadDialog
                isOpen={orderDownloadDialog.isOpen}
                onClose={orderDownloadDialog.onClose}
              />
            )}
          </>
        )}
      </Stack>
    </GridToolbarContainer>
  );
}

export default OrderList;
