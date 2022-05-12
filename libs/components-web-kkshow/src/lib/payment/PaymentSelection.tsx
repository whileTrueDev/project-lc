import { Box, RadioGroup, Radio, Heading, Divider, HStack } from '@chakra-ui/react';
import { useKkshowOrderStore } from '@project-lc/stores';

export function PaymentSelection(): JSX.Element {
  const { handlePaymentType } = useKkshowOrderStore();

  function handleRadio(paymentType: string): void {
    handlePaymentType(paymentType);
  }
  return (
    <Box mb={{ base: '3px', md: '50px' }}>
      <Heading size="lg">결제수단</Heading>
      <Divider m={2} />
      <RadioGroup onChange={(paymentType) => handleRadio(paymentType)}>
        <HStack spacing={5}>
          <Radio value="카드">신용카드</Radio>
          <Radio value="계좌이체">계좌이체</Radio>
          <Radio value="가상계좌">가상계좌</Radio>
        </HStack>
      </RadioGroup>
    </Box>
  );
}
