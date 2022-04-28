import { Box, Button, Heading, Text, Flex, Center } from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { useTerms } from '@project-lc/hooks';

export function PaymentBox(): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;

  function doPayment(): void {
    loadTossPayments(CLIENT_KEY).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        amount: 19000,
        orderId: `f434sdfsd3f45g`,
        orderName: '토스 티셔츠',
        customerName: '고객명',
        successUrl: `http://localhost:4000/payment/success`,
        failUrl: `http://localhost:4000/payment/fail`,
      });
    });
  }

  return (
    <Box p={4}>
      <Box
        position="sticky"
        top="0px"
        left="0px"
        right="0px"
        backgroundColor="white"
        h="280px"
      >
        <Heading size="lg">결제 예정 금액</Heading>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>상품금액</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              19000
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>배송비 (선결제)</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              3000
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>할인금액</Text>
          <Box>
            <Text fontWeight="bold" color="red" fontSize="xl" as="span">
              3000
            </Text>
            <Text color="red" as="span">
              원
            </Text>
          </Box>
        </Flex>
        <Box mb={5}>
          <Text as="sub">하기 필수약관을 확인하였으며, 이에 동의합니다.</Text>
        </Box>
        <Center>
          <Button onClick={() => doPayment()} size="lg" colorScheme="blue">
            322000원 결제하기
          </Button>
        </Center>
      </Box>
      <Text>개인정보 판매자 제공 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>개인정보 수집 및 이용 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>주문상품정보 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
    </Box>
  );
}

export default PaymentBox;
