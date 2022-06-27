import { GridItem, Text } from '@chakra-ui/react';
import { Payment } from '@project-lc/shared-types';

export type TossPaymentDetailProps = {
  paymentData: Payment;
};

export function CardDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>카드사</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card?.company}</Text>
      </GridItem>
      <GridItem>
        <Text>카드번호</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card?.number}</Text>
      </GridItem>
      <GridItem>
        <Text>할부개월</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.card?.installmentPlanMonths}</Text>
      </GridItem>
    </>
  );
}
