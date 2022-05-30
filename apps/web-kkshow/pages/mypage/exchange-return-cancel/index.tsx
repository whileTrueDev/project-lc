import { Box, Text } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import ExchangeReturnListSection from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/ExchangeReturnListSection';

export function ExchangeReturnIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          재배송/환불 신청 내역
        </Text>
        <ExchangeReturnListSection />
      </Box>
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnIndex;
