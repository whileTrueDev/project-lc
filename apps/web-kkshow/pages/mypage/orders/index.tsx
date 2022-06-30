import { Box, Center, Spinner } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import CustomerOrderList from '@project-lc/components-web-kkshow/mypage/orderList/CustomerOrderList';
import { useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function OrderList(): JSX.Element {
  const { data, isLoading } = useProfile();
  const router = useRouter();
  if (isLoading)
    return (
      <CustomerMypageLayout title="주문/배송내역">
        <Center>
          <Spinner />
        </Center>
      </CustomerMypageLayout>
    );
  if (!data || !data?.id) {
    router.push('/login');
  }
  return (
    <CustomerMypageLayout title="주문/배송내역">
      <Box p={[2, 2, 4]}>
        <CustomerOrderList customerId={data?.id} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default OrderList;
