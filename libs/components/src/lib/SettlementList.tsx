import { Link, Box, theme, useColorModeValue } from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core/styles';
import { GridColumns } from '@material-ui/data-grid';
import { useDisplaySize, useSettlementHistory } from '@project-lc/hooks';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { ChakraDataGrid } from './ChakraDataGrid';

const columns: GridColumns = [
  {
    field: 'id',
    headerName: '고유번호',
    renderCell: (params) => (
      <NextLink href="#" passHref>
        <Link color="blue.500" textDecoration="underline" isTruncated>
          {params.row.id}
        </Link>
      </NextLink>
    ),
  },
  { field: 'round', headerName: '회차' },
  {
    field: 'startDate',
    headerName: '출고일',
    renderCell: (params) => dayjs(params.row.startDate).format('YYYY/MM/DD'),
  },
  {
    field: 'doneDate',
    headerName: '구매완료일',
    renderCell: (params) => dayjs(params.row.doneDate).format('YYYY/MM/DD'),
  },
  {
    field: 'date',
    headerName: '정산일',
    renderCell: (params) => dayjs(params.row.date).format('YYYY/MM/DD'),
  },
  { field: 'exportId', headerName: '출고번호', sortable: false },
  { field: 'exportCode', headerName: '출고코드', sortable: false },
  { field: 'buyer', headerName: '구매자', sortable: false },
  { field: 'recipient', headerName: '수령자', sortable: false },
  { field: 'shippingCost', headerName: '배송비', sortable: false },
  { field: 'totalEa', headerName: '총판매수량', sortable: false },
  { field: 'totalPrice', headerName: '총판매금', sortable: false },
  { field: 'totalCommission', headerName: '총수수료', sortable: false },
  { field: 'totalAmount', headerName: '총정산금액', sortable: false },
  { field: 'paymentMethod', headerName: '결제수단', sortable: false },
  { field: 'pg', headerName: 'pg사', sortable: false },
  { field: 'pgCommission', headerName: '전자결제수수료', sortable: false },
  {
    field: 'seller.sellerShop.shopName',
    headerName: '판매자',
    renderCell: (param) =>
      param.row.seller?.sellerShop?.shopName || param.row.sellerEmail,
    sortable: false,
  },
];

// 정산 내역을 보여주는 데이터 그리드
export function SettlementList(): JSX.Element | null {
  const { isDesktopSize } = useDisplaySize();
  const useStyle = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', theme.colors.gray[700]),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
      height: '95%',
    },
  });
  const classes = useStyle();

  const { data } = useSettlementHistory();

  if (!data) return null;

  return (
    <Box px={{ base: 2, sm: 7 }} height="400px">
      <ChakraDataGrid
        classes={{
          columnHeader: classes.columnHeader,
          root: classes.root,
        }}
        minHeight={120}
        headerHeight={50}
        hideFooter
        density="compact"
        columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
        rows={data || []}
        rowCount={5}
        rowsPerPageOptions={[25, 50]}
        disableColumnMenu
        disableColumnFilter
        disableSelectionOnClick
      />
    </Box>
  );
}
