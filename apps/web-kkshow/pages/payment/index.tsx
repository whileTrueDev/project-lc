import { Box, Button } from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

export function Payment(): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY;
  function doPayment(): void {
    loadTossPayments(CLIENT_KEY).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        amount: 1000,
        orderId: `sdfds12dfwesdffr2qwsdfe3s2dd2dewfwe`,
        orderName: '토스 티셔츠',
        customerName: '고객명',
        successUrl: `http://localhost:4000/payment/success`,
        failUrl: `http://localhost:4000/payment/fail`,
      });
    });
  }

  return (
    <Box>
      <Button onClick={() => doPayment()}>결제</Button>
    </Box>
  );
}

export default Payment;
