import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';

export function ExchangeReturnIndex(): JSX.Element {
  const router = useRouter();

  return (
    <CustomerMypageLayout>
      재배송/환불 신청 인덱스 페이지(아마 목록표시)
      {JSON.stringify(router.query)}
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnIndex;
