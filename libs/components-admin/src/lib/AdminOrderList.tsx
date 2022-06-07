import { Link, Button, Text } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminOrderList } from '@project-lc/hooks';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { orderProcessStepKoreanDict } from '@project-lc/shared-types';
import { OrderProcessStep } from '@prisma/client';
import dayjs from 'dayjs';
import NextLink from 'next/link';

const columns: GridColumns = [
  {
    field: 'orderCode',
    headerName: '주문번호',
    renderCell: ({ row }) => (
      <NextLink href={`/customer/order/${row.id}`} passHref>
        <Link href={`/customer/order/${row.id}`}>
          <Text as="button" size="sm" color="blue">
            {row.orderCode}
          </Text>
        </Link>
      </NextLink>
    ),
    flex: 1,
  },
  {
    field: 'orderItem_name',
    headerName: '주문상품명',
    valueGetter: ({ row }: GridRowData) => row.orderItems[0].goods.goods_name,
    flex: 1,
  },
  { field: 'ordererName', headerName: '주문자명' },
  {
    field: 'paymentType',
    headerName: '결제수단',
    valueFormatter: ({ row }: GridRowData) => PaymentTypeSwitch(row.payment?.method),
  },
  { field: 'paymentPrice', headerName: '결제금액' },
  {
    field: 'step',
    headerName: '주문상태',
    valueFormatter: ({ row }: GridRowData) =>
      orderProcessStepKoreanDict[row.step as OrderProcessStep],
  },
  {
    field: 'createDate',
    headerName: '주문날짜',
    valueFormatter: ({ row }) => dayjs(row.createDate).format('YYYY-MM-DD HH:mm:ss'),
    flex: 1,
  },
];

function PaymentTypeSwitch(paymentType: string): string {
  switch (paymentType) {
    case 'card':
      return '카드';
    case 'virtualAccount':
      return '가상계좌';
    case 'transfer':
      return '계좌이체';
    default:
      return '';
  }
}

export function AdminOrderList(): JSX.Element {
  const { data } = useAdminOrderList();
  console.log(data);
  return (
    <ChakraDataGrid
      columns={columns}
      rows={data?.orders || []}
      minH={500}
      disableSelectionOnClick
    />
  );
}
