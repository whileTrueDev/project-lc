import { Box, Text } from '@chakra-ui/react';

export function PaymentNotice(): JSX.Element {
  return (
    <Box>
      <Text fontSize={{ base: 'xs', md: 'sm' }}>
        와일트루는 통신판매중개자로서 오픈마켓 크크쇼의 거래당사자가 아니며, 입점판매자가
        등록한 상품정보 및 거래에 대해 와일트루는 일체 책임을 지지 않습니다.
      </Text>
    </Box>
  );
}

export default PaymentNotice;
