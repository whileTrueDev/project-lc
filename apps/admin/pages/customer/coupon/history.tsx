import { Badge, Box, Button } from '@chakra-ui/react';
import { useAdminCouponHistory } from '@project-lc/hooks';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { CouponLogType } from '@prisma/client';
import { useRouter } from 'next/router';

const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'id',
  },
  {
    field: 'customerCouponId',
    headerName: '쿠폰',
    valueGetter: ({ row }: GridRowData) => row.customerCoupon.coupon.name,
    flex: 1,
  },
  {
    field: 'customerId',
    headerName: '대상 고객',
    valueGetter: ({ row }: GridRowData) => row.customerCoupon.customer.email,
    flex: 1,
  },
  {
    field: 'type',
    headerName: '유형',
    renderCell: ({ row }: GridRowData) => CouponActionType(row.type),
  },
  { field: 'createDate', headerName: '일자', flex: 1 },
  { field: 'orderId', headerName: '주문번호', flex: 1 },
];

export function History(): JSX.Element {
  const router = useRouter();
  const { data } = useAdminCouponHistory();
  return (
    <AdminPageLayout>
      <Box>
        <Button
          onClick={() => {
            router.push('/customer/coupon');
          }}
        >
          쿠폰목록으로 돌아가기
        </Button>
      </Box>
      <ChakraDataGrid rows={data || []} columns={columns} minH={500} />
    </AdminPageLayout>
  );
}

export function CouponActionType(value: CouponLogType): JSX.Element {
  switch (value) {
    case 'issue':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="blue">발급</Badge>
        </Box>
      );
    case 'use':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="red">사용됨</Badge>
        </Box>
      );
    case 'restore':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="yellow">복구</Badge>
        </Box>
      );
    default:
  }
}

export default History;
