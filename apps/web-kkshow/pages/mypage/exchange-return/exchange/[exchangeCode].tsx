import { Stack, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';

export function ExchangeDetailPage(): JSX.Element {
  const router = useRouter();
  const { exchangeCode } = router.query;
  return (
    <CustomerMypageLayout>
      <Stack>
        <Text>재배송코드 : {exchangeCode}</Text>
      </Stack>
    </CustomerMypageLayout>
  );
}

export default ExchangeDetailPage;
