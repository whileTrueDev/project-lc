import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';
import CustomerExchangeDetail from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/detailPage/CustomerExchangeDetail';

export function ExchangeDetailPage(): JSX.Element {
  const router = useRouter();
  const { exchangeCode } = router.query;
  return (
    <CustomerMypageLayout>
      <CustomerExchangeDetail exchangeCode={exchangeCode as string} />
    </CustomerMypageLayout>
  );
}

export default ExchangeDetailPage;
