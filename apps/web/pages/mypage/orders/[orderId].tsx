import { Box, Button, Center, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import {
  ChakraNextImage,
  FmOrderStatusBadge,
  MypageLayout,
} from '@project-lc/components';
import { useFmOrder } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = useFmOrder(orderId);

  if (order.isLoading)
    return (
      <MypageLayout>
        <Center>
          <Spinner />
        </Center>
      </MypageLayout>
    );

  if (!order.isLoading && !order.data)
    return (
      <MypageLayout>
        <Box m="auto" maxW="4xl">
          <Stack spacing={2}>
            <Center>
              <Text>주문 데이터를 불러오지 못했습니다.</Text>
            </Center>
            <Center>
              <Text>주문이 없거나 올바르지 못한 주문번호입니다.</Text>
            </Center>
            <Center>
              <Button onClick={() => router.push('/mypage/orders')}>돌아가기</Button>
            </Center>
          </Stack>
        </Box>
      </MypageLayout>
    );

  return (
    <MypageLayout>
      <Box m="auto" maxW="4xl">
        <Heading>주문 {order.data.id}</Heading>
        <Box>
          <Text>주문일시: {order.data.regist_date}</Text>
          <Text>주문환경: {order.data.sitetype}</Text>
          <Text>주문번호: {order.data.id}</Text>
          <Text>주문자: {order.data.order_user_name}</Text>
          <Text>수령자: {order.data.recipient_user_name}</Text>
          <FmOrderStatusBadge orderStatus={order.data.step} />
        </Box>
        <ChakraNextImage
          width={100}
          height={100}
          src={`http://whiletrue.firstmall.kr${order.data.image}`}
        />
        <Text as="pre">{JSON.stringify(order.data, null, 2)}</Text>
      </Box>
    </MypageLayout>
  );
}

export default OrderDetail;
