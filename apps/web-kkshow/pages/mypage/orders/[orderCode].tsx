import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { OrderInfoExportsList } from '@project-lc/components-web-kkshow/mypage/order/OrderInfoExportsList';
import { OrderInfoItemsList } from '@project-lc/components-web-kkshow/mypage/order/OrderInfoItemsList';
import { OrderInfoPayment } from '@project-lc/components-web-kkshow/mypage/order/OrderInfoPayment';
import { useOrderDetail } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function OrderDetail(): JSX.Element | null {
  const router = useRouter();
  const orderCode = router.query.orderCode as string;
  const orderDetail = useOrderDetail({ orderCode });

  if (!orderDetail.data) return null;
  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <Box my={2}>
          <Button leftIcon={<ChevronLeftIcon />} size="sm" onClick={() => router.back()}>
            뒤로가기
          </Button>
        </Box>

        <Stack spacing={6}>
          <Box>
            <Text fontWeight="bold" fontSize="xl">
              주문상세
            </Text>
            <Text>주문번호 {orderCode}</Text>
          </Box>

          <Box as="section">
            <Text fontWeight="bold">결제 정보</Text>
            <OrderInfoPayment
              orderPrice={orderDetail.data.orderPrice}
              paymentPrice={orderDetail.data.paymentPrice}
              payment={orderDetail.data.payment}
            />
          </Box>

          <Box as="section" minH={100}>
            <Text fontWeight="bold">주문 상품 정보</Text>
            <OrderInfoItemsList orderItems={orderDetail.data.orderItems} />
          </Box>

          <Box as="section" minH={100}>
            <Text fontWeight="bold">배송 정보</Text>
            <OrderInfoExportsList
              order={orderDetail.data}
              exports={orderDetail.data.exports}
            />
          </Box>
        </Stack>
      </Box>
    </CustomerMypageLayout>
  );
}

export default OrderDetail;
