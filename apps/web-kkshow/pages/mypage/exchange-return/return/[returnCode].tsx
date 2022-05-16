import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';
import CustomerReturnDetail from '@project-lc/components-web-kkshow/mypage/exchange-return/detailPage/CustomerReturnDetail';

export function ReturnDetailPage(): JSX.Element {
  const router = useRouter();
  const { returnCode } = router.query;
  return (
    <CustomerMypageLayout>
      <CustomerReturnDetail returnCode={returnCode as string} />
    </CustomerMypageLayout>
  );
}

export default ReturnDetailPage;
