import { ChevronDownIcon, DownloadIcon, Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpoint,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  GridColumns,
  GridRowId,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import { useDisplaySize, useFmOrders } from '@project-lc/hooks';
import {
  convertFmOrderStatusToString,
  convertOrderSitetypeToString,
  FmOrderStatusNumString,
} from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { FaTruck } from 'react-icons/fa';
import { ChakraDataGrid } from './ChakraDataGrid';
import ExportManyDialog from './ExportManyDialog';
import FmOrderStatusBadge from './FmOrderStatusBadge';
import TooltipedText from './TooltipedText';

const columns: GridColumns = [
  {
    field: 'id',
    headerName: '주문번호',
    width: 140,
    renderCell: (params) => {
      return (
        <NextLink href={`/mypage/orders/${params.row.id}`} passHref>
          <Link color="blue.500" textDecoration="underline">
            {params.row.id}
          </Link>
        </NextLink>
      );
    },
  },
  {
    field: 'regist_date',
    headerName: '주문일시',
    width: 150,
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
    field: 'sitetype',
    headerName: '환경',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    width: 120,
    valueFormatter: ({ value }) => convertOrderSitetypeToString(value as any) || '-',
    renderCell: (params) => (
      <Text>{convertOrderSitetypeToString(params.row.sitetype)}</Text>
    ),
  },
  {
    field: 'total_ea',
    headerName: '수량(종류)',
    disableColumnMenu: true,
    disableReorder: true,
    hideSortIcons: true,
    sortable: false,
    valueFormatter: ({ row }) => {
      return row.total_ea + (row.total_type ? `/${row.total_type}` : '');
    },
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
    valueFormatter: ({ row }) => {
      return (
        row.recipient_user_name + (row.order_user_name ? `/${row.order_user_name}` : '')
      );
    },
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
    valueFormatter: ({ row }) => {
      const depositdate = dayjs(row.deposit_date).format('YYYY/MM/DD HH:mm:ss');
      return row.depositor + (row.deposit_date ? `/${depositdate}` : '');
    },
    renderCell: (params) => {
      const t = `${params.row.depositor}
      ${
        params.row.deposit_date
          ? `/${dayjs(params.row.deposit_date).format('YYYY/MM/DD HH:mm:ss')}`
          : ''
      }`;
      return <TooltipedText text={t} />;
    },
  },
  {
    field: 'settleprice',
    headerName: '결제금액',
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
      let howmuch = '';
      if (params.row.settleprice) {
        howmuch = `${Math.floor(Number(params.row.settleprice)).toLocaleString()}원`;
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
    valueFormatter: ({ value }) => convertFmOrderStatusToString(value as any) || '-',
    renderCell: ({ value }) => (
      <Box lineHeight={2}>
        <FmOrderStatusBadge orderStatus={value as FmOrderStatusNumString} />
      </Box>
    ),
  },
];

export function OrderList(): JSX.Element {
  const exportManyDialog = useDisclosure();
  const fmOrderStates = useFmOrderStore();
  const orders = useFmOrders(fmOrderStates);

  const { isDesktopSize } = useDisplaySize();
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');

  return (
    <Box minHeight={{ base: 300, md: 600 }} height={{ base: 300, md: 600 }} mb={24}>
      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        loading={orders.isLoading}
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={orders.data || []}
        checkboxSelection
        disableSelectionOnClick
        selectionModel={fmOrderStates.selectedOrders}
        onSelectionModelChange={fmOrderStates.handleOrderSelected}
        components={{
          Toolbar: () => (
            <OrderToolbar
              options={[
                {
                  name: '출고 처리',
                  onClick: () => exportManyDialog.onOpen(),
                  icon: <Icon as={FaTruck} />,
                  emphasize: true,
                },
              ]}
            />
          ),
          ExportIcon: DownloadIcon,
        }}
      />

      {exportManyDialog.isOpen && orders.data && (
        <ExportManyDialog
          isOpen={exportManyDialog.isOpen}
          onClose={exportManyDialog.onClose}
          orders={orders.data}
        />
      )}
    </Box>
  );
}

export default OrderList;

interface OrderToolbarProps {
  options: {
    name: string;
    onClick: (items: GridRowId[]) => void;
    icon: React.ReactElement;
    emphasize?: boolean;
  }[];
}
export function OrderToolbar({ options }: OrderToolbarProps) {
  const xSize = useBreakpoint();
  const isMobile = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);

  const selectedOrders = useFmOrderStore((state) => state.selectedOrders);

  return (
    <GridToolbarContainer>
      <Stack spacing={2} direction="row">
        {isMobile ? null : (
          <>
            {options.map((opt) => (
              <Button
                key={opt.name}
                size="sm"
                rightIcon={opt.icon}
                colorScheme={opt.emphasize ? 'pink' : undefined}
                isDisabled={selectedOrders.length === 0}
                onClick={() => opt.onClick(selectedOrders)}
              >
                {opt.name}
              </Button>
            ))}
            <Button size="sm" as="div" isDisabled={selectedOrders.length === 0}>
              <GridToolbarExport
                csvOptions={{
                  fileName: `project-lc_주문목록_${dayjs().format(
                    'YYYY-MM-DD-HH-mm-ss',
                  )}`,
                }}
                disabled={selectedOrders.length === 0}
              />
            </Button>
          </>
        )}
      </Stack>
    </GridToolbarContainer>
  );
}
