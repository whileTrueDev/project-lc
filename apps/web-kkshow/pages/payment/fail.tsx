import { Box, Button } from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { usePaymentMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Success(): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY;
  const router = useRouter();

  const { orderId } = router.query;
  const { paymentKey } = router.query;
  const { amount } = router.query;

  return <Box>결제실패</Box>;
}

export default Success;
