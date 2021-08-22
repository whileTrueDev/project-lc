import { Box } from '@chakra-ui/layout';
import {
  Badge,
  Heading,
  List,
  ListItem,
  Text,
  Tooltip,
  useBreakpoint,
  useColorModeValue,
} from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import {
  converOrderSitetypeToString,
  convertFmOrderToString,
  FindFmOrderRes,
  getFmOrderColor,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useFmOrders } from '@project-lc/hooks';
import { useFmOrderStore } from '@project-lc/stores';
import { useMemo } from 'react';
import { ChakraDataGrid } from './ChakraDataGrid';
import TooltipedText from './TooltipedText';

const columns: GridColumns = [
  { field: 'id', headerName: '주문번호', width: 140 },
  {
    field: 'regist_date',
    headerName: '주문일시',
    width: 150,
    renderCell: (params) => {
      const date = dayjs(params.row.regist_date).format('YYYY/MM/DD HH:mm:ss');
      return <TooltipedText text={date} />;
    },
  },
  {
    field: 'sitetype',
    headerName: '환경',
    width: 120,
    renderCell: (params) => (
      <Text>{converOrderSitetypeToString(params.row.sitetype)}</Text>
    ),
  },
  {
    field: 'goods_name',
    headerName: '상품',
    width: 220,
  },
  {
    field: 'total_ea',
    headerName: '수량(종류)',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    renderCell: (params) => (
      <Text>
        {params.row.total_ea}
        {params.row.total_type ? ` (${params.row.total_type})` : ''}
      </Text>
    ),
  },
  {
    field: 'recipient_user_name',
    headerName: '주문자/받는분',
    width: 120,
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    renderCell: (params) => (
      <Text>
        {params.row.recipient_user_name}
        {params.row.order_user_name ? `/${params.row.order_user_name}` : ''}
      </Text>
    ),
  },
  {
    field: 'depositor',
    headerName: '결제수단/일시',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    width: 120,
    renderCell: (params) => (
      <Text>
        {params.row.depositor}
        {params.row.deposite_date ? `/${params.row.deposite_date}` : ''}
      </Text>
    ),
  },
  {
    field: 'settleprice',
    headerName: '결제금액',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    width: 120,
    renderCell: (params) => {
      let howmuch = '';
      if (params.row.settleprice) {
        howmuch = `${Math.floor(params.row.settleprice).toLocaleString()}원`;
      }
      return <TooltipedText text={howmuch} />;
    },
  },
  {
    field: 'step',
    headerName: '주문상태',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    renderCell: (param) => (
      <Badge lineHeight={2} colorScheme={getFmOrderColor(param.row.step)} variant="solid">
        {convertFmOrderToString(param.row.step)}
      </Badge>
    ),
  },
];

export function OrderList(): JSX.Element {
  const fmOrderStates = useFmOrderStore();
  const orders = useFmOrders(fmOrderStates);

  const xSize = useBreakpoint();
  const isMobile = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);
  const isMiddleSize = useMemo(() => xSize && ['md', 'lg'].includes(xSize), [xSize]);
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');

  if (isMobile) {
    return (
      <Box>
        <MobileOrderList orders={orders.data || []} />
      </Box>
    );
  }

  return (
    <Box minHeight={600} height={600}>
      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        loading={orders.isLoading}
        columns={columns.map((x) => ({ ...x, flex: isMiddleSize ? undefined : 1 }))}
        rows={orders.data || []}
      />
    </Box>
  );
}

export default OrderList;

export function MobileOrderList({ orders }: { orders: FindFmOrderRes[] }) {
  return (
    <List p={2} spacing={2}>
      {orders.map((order) => (
        <ListItem key={order.order_seq}>
          <MobileOrderListItem order={order} />
        </ListItem>
      ))}
    </List>
  );
}

export function MobileOrderListItem({ order }: { order: FindFmOrderRes }) {
  return (
    <Box>
      <Heading as="h5" size="sm">
        상품명 {order.goods_name}
      </Heading>
      <Text fontSize="sm">주문번호 {order.id}</Text>
      <Text fontSize="sm">결제 {order.depositor}</Text>
    </Box>
  );
}
