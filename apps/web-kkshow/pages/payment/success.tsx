import { Box, Button } from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { usePaymentMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Success(): JSX.Element {
  const router = useRouter();

  const { orderId } = router.query;
  const { paymentKey } = router.query;
  const { amount } = router.query;

  const { mutateAsync } = usePaymentMutation();
  useEffect(() => {
    if (orderId && paymentKey && amount) {
      mutateAsync({ orderId, paymentKey, amount });
    }
  }, [mutateAsync, orderId, paymentKey, amount]);

  return <Box>결제성공</Box>;
}

export default Success;
