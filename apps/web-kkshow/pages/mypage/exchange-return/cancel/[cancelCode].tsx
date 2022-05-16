import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import CustomerOrderCancelDetail from '@project-lc/components-web-kkshow/mypage/exchange-return/detailPage/CustomerOrderCancelDetail';
import { useRouter } from 'next/router';

export function OrderCancelDetailPage(): JSX.Element {
  const router = useRouter();
  const { cancelCode } = router.query;
  return (
    <CustomerMypageLayout>
      <CustomerOrderCancelDetail cancelCode={cancelCode as string} />
    </CustomerMypageLayout>
  );
}

export default OrderCancelDetailPage;
