import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { GridColumns, GridRowParams } from '@material-ui/data-grid';
import { OrderItemOption, OrderProcessStep } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import TooltipedText from '@project-lc/components-core/TooltipedText';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import {
  AdminLiveShoppingGiftOrderList,
  useAdminLiveShoppingGiftOrderList,
  useDisplaySize,
} from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { getAdminHost, getOrderItemOptionSteps } from '@project-lc/utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const columns: GridColumns = [
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
    renderCell: ({ row }) => {
      const goodsNames = row.orderItems
        .map((orderItem: { goods: { goods_name: string } }) => orderItem.goods.goods_name)
        .join(' ,');
      return <Text>{goodsNames}</Text>;
    },
    width: 220,
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
        .flatMap((oi: { options: OrderItemOption[] }) => oi.options)
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
    headerName: '받는분/주문자',
    width: 120,
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    disableExport: true,
    valueFormatter: ({ row }) => row.recipientName,
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
        .flatMap((oi: { options: OrderItemOption[] }) => oi.options)
        .reduce(
          (sum: number, cur: OrderItemOption) => sum + Number(cur.discountPrice),
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
    renderCell: ({ row }) => {
      const orderItemOptionSteps = getOrderItemOptionSteps(
        row as AdminLiveShoppingGiftOrderList[number],
      );
      return (
        <Box lineHeight={2}>
          {orderItemOptionSteps.map((oios) => (
            <OrderStatusBadge key={oios} step={oios} />
          ))}
        </Box>
      );
    },
  },
];

export function AdminGiftList(props: {
  selectedLiveShoppingId: number | null;
}): JSX.Element {
  const { selectedLiveShoppingId } = props;

  const { data, isLoading, refetch } = useAdminLiveShoppingGiftOrderList({
    liveShoppingId: selectedLiveShoppingId,
  });

  const { isDesktopSize } = useDisplaySize();
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');

  const orderData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  // 크크쇼 주문정보로 이동(새창)
  const handleRowClick = (param: GridRowParams): void => {
    if (param.row.id) {
      const url = `${getAdminHost()}/order/list/${param.row.id}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Box minHeight={{ base: 300, md: 600 }} mt={3}>
      {selectedLiveShoppingId && (
        <Button size="xs" onClick={() => refetch()} disabled={!selectedLiveShoppingId}>
          새로고침
        </Button>
      )}

      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        minH={500}
        rowsPerPageOptions={[10, 20, 50, 100]}
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        loading={isLoading}
        columns={columns.map((col) => {
          if (col.headerName === '상품') {
            const flex = isDesktopSize ? 1 : undefined;
            return { ...col, flex };
          }
          return col;
        })}
        rows={orderData}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
