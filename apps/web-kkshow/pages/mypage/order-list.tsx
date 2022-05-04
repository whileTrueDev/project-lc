import CustomerOrderList from '@project-lc/components-web-kkshow/mypage/orderList/CustomerOrderList';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';

export function OrderList(): JSX.Element {
  // TODO : 로그인한 소비자 profile 조회 (지금 customerId = 1로 고정해서 만듦)
  // if (loading) return 'loading';
  // if (!customerId) redirect to login page
  return (
    <KkshowLayout>
      <CustomerOrderList customerId={1} />
    </KkshowLayout>
  );
}

export default OrderList;
