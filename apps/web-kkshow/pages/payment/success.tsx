/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { useOrderCreateMutation, usePaymentMutation } from '@project-lc/hooks';
import {
  CreateOrderDto,
  CreateOrderForm,
  CreateOrderShippingData,
  CreateOrderShippingDto,
} from '@project-lc/shared-types';
import { OrderShippingData, useKkshowOrderStore } from '@project-lc/stores';
import { deleteCookie, getCookie } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

/** KkshowOrderStore.shipping을 CreateOrderShippingDto 형태로 바꾸기 */
function OrderShippingDataToDto(
  orderShippingData: OrderShippingData,
): CreateOrderShippingData[] {
  const shippingGroupIdList = Object.keys(orderShippingData).map((id) => Number(id));

  return shippingGroupIdList.map((id) => {
    const { items, cost } = orderShippingData[id];
    return {
      shippingCost: cost ? cost.add + cost.std : 0,
      shippingGroupId: id,
      items,
    };
  });
}

/** createOrderForm 에서 createOrderDto에 해당하는 데이터만 가져오기
 * CreateOrderForm FormProvivder 내부에서 사용하기 위한 값 제외
 */
function extractCreateOrderDtoDataFromCreateOrderForm(
  formData: CreateOrderForm,
): CreateOrderDto {
  const {
    ordererPhone1,
    ordererPhone2,
    ordererPhone3,
    paymentType,
    recipientPhone1,
    recipientPhone2,
    recipientPhone3,
    ...createOrderDtoData
  } = formData;
  return { ...createOrderDtoData };
}

export function Success(): JSX.Element {
  const router = useRouter();
  const isRequested = useRef<boolean>(false);

  const orderCode = router.query.orderId as string;
  const paymentKey = router.query.paymentKey as string;
  const redirectAmount = Number(router.query.amount as string);

  const { order, shipping, resetOrder, resetShippingData, resetShopNames } =
    useKkshowOrderStore();

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
      })
        .then((item) => {
          deleteCookie('amount');
          isRequested.current = true;
          if (item.status === 'error') {
            router.push(`/payment/fail?message=${item.message}`);
          } else {
            const orderPaymentId = item.orderPaymentId || undefined; // 토스페이먼츠 결제요청 후 생성한 OrderPayment.id;

            // * createOrderDto 만들기 :  createOrderForm 에서 createOrderDto에 해당하는 데이터만 가져오기
            const createOrderDtoData =
              extractCreateOrderDtoDataFromCreateOrderForm(order);

            const paymentPrice = tossPaymentsAmount; // 결제금액 = 할인(쿠폰,할인코드,마일리지 적용)이후 사용자가 실제 결제한/입금해야 할 금액 + 총 배송비

            const createOrderDto: CreateOrderDto = {
              ...createOrderDtoData,
              paymentId: orderPaymentId,
              orderCode,
              recipientEmail: order.recipientEmail || '',
              paymentPrice,
            };

            // * CreateOrderShippingDto 만들기 :  store.shipping을 dto 형태로 바꾸기
            const shippingDto: CreateOrderShippingDto = {
              shipping: OrderShippingDataToDto(shipping),
            };

            const dto = {
              order: createOrderDto,
              shipping: shippingDto,
            };

            // * 주문생성
            createOrder
              .mutateAsync(dto)
              .then((res) => {
                // 주문스토어 주문,배송비정보 리셋
                resetOrder();
                resetShippingData();
                resetShopNames();

                // 주문완료페이지로 이동
                const orderId = res.id;
                router.push(`/payment/receipt?orderId=${orderId}&orderCode=${orderCode}`);
              })
              .catch((e) => {
                console.error(e);
                console.error(e.response?.data?.message);
                router.push('/payment/fail?message=주문생성 오류');
              });
          }
        })
        .catch((err) => {
          console.error(err);
          console.error(err.response?.data?.message);
          router.push('/payment/fail?message=결제승인요청 오류');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
