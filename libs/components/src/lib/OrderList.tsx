import { Box } from '@chakra-ui/layout';
import { Badge, Text, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import { GridColumns } from '@material-ui/data-grid';
import {
  converOrderSitetypeToString,
  convertFmOrderToString,
  FmOrder,
  getFmOrderColor,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { ChakraDataGrid } from './ChakraDataGrid';

const columns: GridColumns = [
  { field: 'id', headerName: '주문번호' },
  {
    field: 'regist_date',
    headerName: '주문일시',
    renderCell: (params) => (
      <Text>{dayjs(params.row.regist_date).format('YYYY/MM/DD HH:mm:ss')}</Text>
    ),
  },
  {
    field: 'sitetype',
    headerName: '주문환경',
    renderCell: (params) => (
      <Text>{converOrderSitetypeToString(params.row.sitetype)}</Text>
    ),
  },
  {
    field: 'goods_name',
    headerName: '주문상품정보',
  },
  {
    field: 'total_ea',
    headerName: '수량 (종류)',
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
  },
  {
    field: 'settleprice',
    headerName: '결제금액',
  },
  {
    field: 'step',
    headerName: '주문상태',
    renderCell: (param) => (
      <Badge lineHeight={2} colorScheme={getFmOrderColor(param.row.step)} variant="solid">
        {convertFmOrderToString(param.row.step)}
      </Badge>
    ),
  },
];

interface OrderListProps {
  isLoading?: boolean;
  orders: FmOrder[];
}
export function OrderList({ orders, isLoading }: OrderListProps): JSX.Element {
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');
  const xSize = useBreakpoint();
  if (xSize && ['base', 'sm'].includes(xSize)) {
    return <Box>모바일 주문목록</Box>;
  }
  if (xSize && ['md', 'lg'].includes(xSize)) {
    return <Box>중간화면 주문목록</Box>;
  }
  return (
    <Box minHeight={600} height={600}>
      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        loading={isLoading}
        columns={columns.map((x) => ({ ...x, flex: 1 }))}
        rows={orders}
      />
    </Box>
  );
}

export default OrderList;
