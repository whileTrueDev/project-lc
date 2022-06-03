import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react';
import { GridColumns, GridRowParams } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import TooltipedText from '@project-lc/components-core/TooltipedText';
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import {
  useAdminLiveShoppingGiftOrderList,
  useDisplaySize,
  useFmOrdersByGoods,
} from '@project-lc/hooks';
import {
  convertFmOrderStatusToString,
  FmOrderStatusNumString,
  getFmOrderStatusByNames,
  LiveShoppingProgressParams,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export type SeletctedLiveShoppingType = Partial<LiveShoppingProgressParams> & {
  goodsId: number;
  sellStartDate?: Date | null;
};

const columns: GridColumns = [
  {
    field: 'regist_date',
    headerName: '주문일시',
    width: 170,
    valueFormatter: ({ row }) =>
      dayjs(row.regist_date as any).format('YYYY/MM/DD HH:mm:ss'),
    renderCell: (params) => {
      const date = dayjs(params.row.regist_date).format('YYYY/MM/DD HH:mm:ss');
      return <TooltipedText text={date} />;
    },
  },
  {
    field: 'goods_name',
    headerName: '상품',
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
    valueFormatter: ({ row }) => {
      return row.totalEa + (row.totalType ? `/${row.totalType}` : '');
    },
    renderCell: (params) => (
      <Text>
        {params.row.totalEa}
        {params.row.totalType ? ` (${params.row.totalType})` : ''}
      </Text>
    ),
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
    valueFormatter: ({ row }) => row.recipient_user_name,
    renderCell: (params) => (
      <Text>
        {params.row.recipient_user_name}
        {params.row.order_user_name ? `/${params.row.order_user_name}` : ''}
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
    valueFormatter: ({ value }) => {
      let howmuch = '';
      if (!Number.isNaN(Number(value))) {
        howmuch = `${Math.floor(Number(value)).toLocaleString()}원`;
      }
      return howmuch;
    },
    renderCell: (params) => {
      let text = '';
      if (params.row.totalPrice) {
        const totalPrice = Math.floor(Number(params.row.totalPrice));
        const shppingCost = Math.floor(Number(params.row.totalShippingCost));
        let howMuch: number;
        if (!Number.isNaN(shppingCost)) {
          howMuch = totalPrice + shppingCost;
        } else {
          howMuch = totalPrice;
        }
        text = `${howMuch.toLocaleString()}원`;
      }
      return <TooltipedText text={text} />;
    },
  },
  {
    field: 'step',
    headerName: '주문상태',
    disableColumnMenu: true,
    disableReorder: true,
    width: 120,
    valueFormatter: ({ value }) => convertFmOrderStatusToString(value as any) || '-',
    renderCell: ({ value }) => (
      <Box lineHeight={2}>
        <FmOrderStatusBadge orderStatus={value as FmOrderStatusNumString} />
      </Box>
    ),
  },
];

function getDateString(date: Date | string | null | undefined): string | undefined {
  if (date) {
    return dayjs(date).format('YYYY-MM-DD');
  }
  return undefined;
}

export function AdminGiftList(props: {
  selectedGoods: SeletctedLiveShoppingType;
  selectedLiveShoppingId: number | null;
}): JSX.Element {
  const { selectedGoods, selectedLiveShoppingId } = props;

  const { data, refetch } = useAdminLiveShoppingGiftOrderList({
    liveShoppingId: selectedLiveShoppingId,
  });

  const orders = useFmOrdersByGoods(
    {
      searchStatuses: getFmOrderStatusByNames([
        '결제확인',
        '배송완료',
        '배송중',
        '부분배송완료',
        '부분배송중',
        '부분출고완료',
        '부분출고준비',
        '상품준비',
        '주문접수',
        '출고완료',
        '출고준비',
      ]),
      goodsIds: [selectedGoods.goodsId],
      searchStartDate: getDateString(selectedGoods?.sellStartDate),
      searchEndDate: getDateString(selectedGoods?.sellEndDate),
    },
    {},
    'admin',
  );
  const { isDesktopSize } = useDisplaySize();
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');

  const filteredOrders = useMemo(() => {
    if (!orders.data) return [];
    return orders.data.filter((d) => {
      // 선물하기인 주문만 필터링
      return d.giftFlag;
    });
  }, [orders.data]);

  // 퍼스트몰 주문정보로 이동하기
  // TODO: 크크쇼 주문정보로 이동하기
  const handleRowClick = (param: GridRowParams): void => {
    if (param.row?.order_seq) {
      const url = `http://whiletrue.firstmall.kr/admin/order/view?query_string=&no=${param.row?.order_seq}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Box minHeight={{ base: 300, md: 600 }} mt={3}>
      <Button size="xs" onClick={() => refetch()} disabled={!selectedLiveShoppingId}>
        새로고침
      </Button>
      <Box>{JSON.stringify(data)}</Box>
      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        minH={500}
        rowsPerPageOptions={[10, 20, 50, 100]}
        disableSelectionOnClick
        disableColumnMenu
        density="compact"
        loading={orders.isLoading}
        columns={columns.map((col) => {
          if (col.headerName === '상품') {
            const flex = isDesktopSize ? 1 : undefined;
            return { ...col, flex };
          }
          return col;
        })}
        rows={filteredOrders}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
