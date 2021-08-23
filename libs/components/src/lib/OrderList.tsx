import { ChevronDownIcon, DownloadIcon, Icon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpoint,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  GridColumns,
  GridRowId,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
} from '@material-ui/data-grid';
import { useFmOrders } from '@project-lc/hooks';
import {
  converOrderSitetypeToString,
  convertFmOrderToString,
  getFmOrderColor,
} from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { FaTruck } from 'react-icons/fa';
import { ChakraDataGrid } from './ChakraDataGrid';
import TooltipedText from './TooltipedText';

const columns: GridColumns = [
  { field: 'id', headerName: '주문번호', width: 140 },
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
    valueFormatter: ({ value }) => converOrderSitetypeToString(value as any) || '-',
    renderCell: (params) => (
      <Text>{converOrderSitetypeToString(params.row.sitetype)}</Text>
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
      return row.depositor + (row.deposite_date ? `/${row.deposite_date}` : '');
    },
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
    valueFormatter: ({ value }) => convertFmOrderToString(value as any) || '-',
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
  const isDesktopSize = useMemo(
    () => xSize && !['md', 'lg', 'base', 'sm'].includes(xSize),
    [xSize],
  );
  const dataGridBgColor = useColorModeValue('inherit', 'gray.300');

  // * 선택된 행
  const [selectedItems, setSelectedItems] = useState<GridRowId[]>([]);
  const handleRowSelected = (s: GridSelectionModel) => {
    setSelectedItems(s);
  };

  return (
    <Box minHeight={{ base: 300, md: 600 }} height={{ base: 300, md: 600 }}>
      <ChakraDataGrid
        bg={dataGridBgColor}
        autoHeight
        loading={orders.isLoading}
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={orders.data || []}
        checkboxSelection
        onSelectionModelChange={handleRowSelected}
        components={{
          Toolbar: () => (
            <OrderToolbar
              options={[
                {
                  name: '출고 처리',
                  onClick: (itemIds) => console.log(itemIds),
                  icon: <Icon as={FaTruck} />,
                  emphasize: true,
                },
              ]}
              selectedItems={selectedItems}
            />
          ),
          ExportIcon: DownloadIcon,
        }}
      />
    </Box>
  );
}

export default OrderList;

interface OrderToolbarProps {
  selectedItems: GridRowId[];
  options: {
    name: string;
    onClick: (items: GridRowId[]) => void;
    icon: React.ReactElement;
    emphasize?: boolean;
  }[];
}
export function OrderToolbar({ selectedItems, options }: OrderToolbarProps) {
  const xSize = useBreakpoint();
  const isMobile = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);
  return (
    <GridToolbarContainer>
      <Stack spacing={2} direction="row">
        {isMobile ? (
          <Menu>
            <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon />}>
              주문 처리 메뉴
            </MenuButton>
            <MenuList>
              {options.map((opt) => (
                <MenuItem
                  icon={opt.icon}
                  onClick={() => opt.onClick(selectedItems)}
                  key={opt.name}
                  isDisabled={selectedItems.length === 0}
                >
                  {opt.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ) : (
          <>
            {options.map((opt) => (
              <Button
                key={opt.name}
                size="sm"
                rightIcon={opt.icon}
                colorScheme={opt.emphasize ? 'pink' : undefined}
                isDisabled={selectedItems.length === 0}
              >
                {opt.name}
              </Button>
            ))}
            <Button size="sm" as="div" isDisabled={selectedItems.length === 0}>
              <GridToolbarExport
                csvOptions={{ fileName: '주문목록' }}
                disabled={selectedItems.length === 0}
              />
            </Button>
          </>
        )}
      </Stack>
    </GridToolbarContainer>
  );
}
