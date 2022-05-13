import CustomerOrderList from '@project-lc/components-web-kkshow/mypage/orderList/CustomerOrderList';
import { useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

export function OrderList(): JSX.Element {
  const { data, isLoading } = useProfile();
  const router = useRouter();
  if (isLoading) return <Text>loading</Text>;
  if (!data || !data.id) {
    router.push('/login');
  }
  return (
    <CustomerMypageLayout>
      <CustomerOrderList customerId={data.id} />
    </CustomerMypageLayout>
  );
}

export default OrderList;
