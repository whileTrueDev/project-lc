import { GridItem, Text } from '@chakra-ui/react';
import { TossPaymentDetailProps } from './CardDetail';

export function VirtualAccountDetail(props: TossPaymentDetailProps): JSX.Element {
  const { paymentData } = props;
  return (
    <>
      <GridItem>
        <Text>은행</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount?.bank}</Text>
      </GridItem>
      <GridItem>
        <Text>계좌타입</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount?.accountType}</Text>
      </GridItem>
      <GridItem>
        <Text>입금계좌번호</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount?.accountNumber}</Text>
      </GridItem>
      <GridItem>
        <Text>입금기한</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData.virtualAccount?.dueDate}</Text>
      </GridItem>
      <GridItem>
        <Text>입금상태</Text>
      </GridItem>
      <GridItem>
        <Text>
          {paymentData.virtualAccount?.settlementStatus === 'COMPLETE'
            ? '입금완료'
            : '입금대기'}
        </Text>
      </GridItem>
    </>
  );
}
