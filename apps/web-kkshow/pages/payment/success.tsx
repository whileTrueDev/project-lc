import { Heading, Flex, Spinner } from '@chakra-ui/react';
import { usePaymentMutation } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';

function getCookie(): number | null {
  const value = document.cookie.match(`(^|;) ?amount=([^;]*)(;|$)`);
  return value ? Number(value[2]) : null;
}

function deleteCookie(): void {
  const date = new Date();
  document.cookie = `amount= ; expires=${date.toUTCString()}; path=/`;
}

export function Success(): JSX.Element {
  const router = useRouter();
  const [isRequested, setIsRequested] = useState(false);

  const orderId = router.query.orderId as string;
  const paymentKey = router.query.paymentKey as string;
  const redirectAmount = Number(router.query.amount as string);

  const { mutateAsync } = usePaymentMutation();

  useEffect(() => {
    const tossPaymentsAmount = getCookie();
    if (
      orderId &&
      paymentKey &&
      redirectAmount &&
      !isRequested &&
      redirectAmount === tossPaymentsAmount
    ) {
      mutateAsync({
        orderId,
        paymentKey,
        amount: redirectAmount,
      }).then((item) => {
        deleteCookie();
        setIsRequested(true);
        if (item.status === 'error') {
          router.push(`/payment/fail?message=${item.message}`);
        } else {
          router.push(`/payment/receipt?orderId=${item.orderId}`);
        }
      });
    } else if (
      orderId &&
      paymentKey &&
      redirectAmount &&
      !isRequested &&
      redirectAmount !== tossPaymentsAmount
    ) {
      deleteCookie();
      router.push('/payment/fail?message=결제금액 오류');
    }
  }, [orderId, paymentKey, redirectAmount]);

  return (
    <KkshowLayout>
      <Flex m="auto" alignItems="center" justifyContent="center" direction="column" p={2}>
        <Flex alignItems="center" justifyContent="center" direction="column" h="2xl">
          <Spinner mb={10} />
          <Heading>주문 처리가 진행중입니다</Heading>
        </Flex>
      </Flex>
    </KkshowLayout>
  );
}

export default Success;
