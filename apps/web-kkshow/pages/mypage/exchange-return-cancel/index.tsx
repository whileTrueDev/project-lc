import { Box, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import ExchangeReturnListSection from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/ExchangeReturnListSection';

export function ExchangeReturnIndex(): JSX.Element {
  const title = '재배송/환불 신청 내역';
  return (
    <CustomerMypageLayout title={title}>
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <ExchangeReturnListSection />
      </Box>
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnIndex;
