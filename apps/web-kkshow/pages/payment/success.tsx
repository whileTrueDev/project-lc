import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { useOrderCreateMutation, usePaymentMutation } from '@project-lc/hooks';
import { CreateOrderDto } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { deleteCookie, getCookie } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export function Success(): JSX.Element {
  const router = useRouter();
  const isRequested = useRef<boolean>(false);

  const orderCode = router.query.orderId as string;
  const paymentKey = router.query.paymentKey as string;
  const redirectAmount = Number(router.query.amount as string);

  const order = useKkshowOrderStore((s) => s.order);

  const { mutateAsync } = usePaymentMutation();

  const createOrder = useOrderCreateMutation();

  useEffect(() => {
    const tossPaymentsAmount = Number(getCookie('amount'));
    if (
      orderCode &&
      paymentKey &&
      redirectAmount &&
      !isRequested.current &&
      redirectAmount === tossPaymentsAmount
    ) {
      mutateAsync({
        orderId: orderCode,
        paymentKey,
        amount: redirectAmount,
      }).then((item) => {
        deleteCookie('amount');
        isRequested.current = true;
        if (item.status === 'error') {
          router.push(`/payment/fail?message=${item.message}`);
        } else {
          // TODO: 여기서 주문 생성 이후 orderId 받아오기
          console.log('after dopayment redirection order: ', order);

          // * createOrderForm 에서 createOrderDto에 해당하는 데이터만 가져오기
          const {
            ordererPhone1,
            ordererPhone2,
            ordererPhone3,
            paymentType,
            recipientPhone1,
            recipientPhone2,
            recipientPhone3,
            ...createOrderDtoData
          } = order;
          const createOrderDto: CreateOrderDto = {
            ...createOrderDtoData,
            orderCode,
            recipientEmail: order.recipientEmail || '',
            paymentPrice: tossPaymentsAmount,
          };

          console.log('createOrderDto', createOrderDto);
          // * 주문생성
          createOrder
            .mutateAsync(createOrderDto)
            .then((res) => {
              console.log(res);
              const orderId = res.id;
              router.push(`/payment/receipt?orderId=${orderId}&orderCode=${orderCode}`); // todo : 1 들어간 자리에 orderId 넣기
            })
            .catch((e) => {
              console.error(e);
            });
        }
      });
    } else if (
      orderCode &&
      paymentKey &&
      redirectAmount &&
      !isRequested.current &&
      redirectAmount !== tossPaymentsAmount
    ) {
      deleteCookie('amount');
      router.push('/payment/fail?message=결제금액 오류');
    }
  }, [orderCode, paymentKey, redirectAmount]);

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
