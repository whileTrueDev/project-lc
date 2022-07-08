import { Grid, GridItem, Text } from '@chakra-ui/react';
import { OrderPayment } from '@prisma/client';
import { convertPaymentMethodToKrString } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';

interface OrderInfoPaymentProps {
  orderPrice: number;
  paymentPrice: number;
  payment?: OrderPayment;
}
export function OrderInfoPayment({
  orderPrice,
  paymentPrice,
  payment,
}: OrderInfoPaymentProps): JSX.Element {
  return (
    <Grid gridTemplateColumns="1fr 1fr" maxW={400}>
      {payment?.method && (
        <>
          <GridItem>결제 방식</GridItem>
          <GridItem textAlign="right">
            <Text>{convertPaymentMethodToKrString(payment?.method)}</Text>
          </GridItem>

          {payment.method === 'virtualAccount' && (
            <>
              <GridItem>가상 계좌</GridItem>
              <GridItem textAlign="right">
                <Text>{payment.account}</Text>
              </GridItem>
              <GridItem>입금 완료여부</GridItem>
              <GridItem textAlign="right">
                {payment.depositDoneFlag ? '예' : '아니오'}
              </GridItem>
              {payment.depositDoneFlag ? (
                <>
                  <GridItem>입금 완료일시</GridItem>
                  <GridItem textAlign="right">
                    <Text>
                      {dayjs(payment.depositDate).format('YYYY/MM/DD HH:mm:ss')}
                    </Text>
                  </GridItem>
                </>
              ) : (
                <>
                  <GridItem>입금 기한</GridItem>
                  <GridItem textAlign="right">
                    <Text>
                      {dayjs(payment.depositDueDate).format('YYYY/MM/DD HH:mm:ss')}
                    </Text>
                  </GridItem>
                </>
              )}
            </>
          )}
        </>
      )}

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
