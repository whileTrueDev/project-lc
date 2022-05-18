import { Flex, Radio, RadioGroup } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useKkshowOrder } from '@project-lc/stores';

export function PaymentSelection(): JSX.Element {
  const paymentType = useKkshowOrder((s) => s.paymentType);
  const handlePaymentType = useKkshowOrder((s) => s.handlePaymentType);

  return (
    <SectionWithTitle title="결제수단">
      <RadioGroup
        value={paymentType}
        onChange={(_paymentType) => handlePaymentType(_paymentType)}
      >
        <Flex direction={{ base: 'column', sm: 'row' }} gap={2}>
          <Radio value="카드">카드결제</Radio>
          <Radio value="계좌이체">계좌이체</Radio>
          <Radio value="가상계좌">가상계좌</Radio>
        </Flex>
      </RadioGroup>
    </SectionWithTitle>
  );
}
