import { Grid, GridItem, Text } from '@chakra-ui/react';
import { getLocaleNumber } from '@project-lc/utils-frontend';

interface OrderInfoPaymentProps {
  orderPrice: number;
  paymentPrice: number;
}
export function OrderInfoPayment({
  orderPrice,
  paymentPrice,
}: OrderInfoPaymentProps): JSX.Element {
  return (
    <Grid gridTemplateColumns="1fr 1fr" maxW={400}>
      <GridItem>상품 금액</GridItem>
      <GridItem textAlign="right">
        <Text>{getLocaleNumber(orderPrice)}원</Text>
      </GridItem>

      <GridItem>실제 결제 금액</GridItem>
      <GridItem textAlign="right">
        <Text>{getLocaleNumber(paymentPrice)}원</Text>
      </GridItem>
    </Grid>
  );
}
