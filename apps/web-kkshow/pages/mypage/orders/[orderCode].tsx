import { Box, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useOrderDetail } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderCode = router.query.orderCode as string;
  const orderDetail = useOrderDetail({ orderCode });

  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <Text>주문상세</Text>
      </Box>

      <Box>
        <pre>{JSON.stringify(orderDetail.data, null, 2)}</pre>
      </Box>
    </CustomerMypageLayout>
  );
}

export default OrderDetail;
