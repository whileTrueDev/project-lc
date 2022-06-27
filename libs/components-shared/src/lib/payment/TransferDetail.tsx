import { GridItem, Text } from '@chakra-ui/react';
import { TossPaymentDetailProps } from './CardDetail';

export function TransferDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>은행</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.transfer?.bank}</Text>
      </GridItem>
      <GridItem>
        <Text>계좌타입</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.transfer?.settlementStatus}</Text>
      </GridItem>
    </>
  );
}
