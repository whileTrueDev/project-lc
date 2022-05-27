import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';
import CustomerExchangeDetail from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/detailPage/CustomerExchangeDetail';
import { Box } from '@chakra-ui/react';

export function ExchangeDetailPage(): JSX.Element {
  const router = useRouter();
  const { exchangeCode } = router.query;
  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <CustomerExchangeDetail exchangeCode={exchangeCode as string} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default ExchangeDetailPage;
