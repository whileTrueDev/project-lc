/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { usePaymentMutation } from '@project-lc/hooks';
import {
  CreateOrderDto,
  CreateOrderForm,
  CreateOrderShippingData,
  CreateOrderShippingDto,
  PaymentRequestDto,
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

  /** 해당 라우터 내부에서 결제->주문 생성을 순차적으로 처리함 */
  const { mutateAsync } = usePaymentMutation();

  // temp 로 요청
  useEffect(() => {
    const tossPaymentsAmount = Number(getCookie('amount'));

    if (isRequested.current) return;

    // 결제금액 확인
    if (redirectAmount && redirectAmount !== tossPaymentsAmount) {
      deleteCookie('amount');
      router.push('/payment/fail?message=결제금액 오류');
    }

    if (
      orderCode &&
      paymentKey &&
      redirectAmount &&
      !isRequested.current &&
      redirectAmount === tossPaymentsAmount
    ) {
      const paymentRequestDto: PaymentRequestDto = {
        orderId: orderCode,
        paymentKey,
        amount: redirectAmount,
      };
      const createOrderDtoTemp: CreateOrderDto = {
        ...extractCreateOrderDtoDataFromCreateOrderForm(order),
        orderCode,
        recipientEmail: order.recipientEmail || '',
        paymentPrice: tossPaymentsAmount, // 결제금액 = 할인(쿠폰,할인코드,마일리지 적용)이후 사용자가 실제 결제한/입금해야 할 금액 + 총 배송비,
      };

      // * CreateOrderShippingDto 만들기 :  store.shipping을 dto 형태로 바꾸기
      const shippingDtoTemp: CreateOrderShippingDto = {
        shipping: OrderShippingDataToDto(shipping),
      };

      // 결제 & 주문생성 dto 한번에 보내기
      mutateAsync({
        payment: paymentRequestDto,
        order: createOrderDtoTemp,
        shipping: shippingDtoTemp,
      })
        .then((res) => {
          /** 결제 && 주문생성 완료 이후  할일들 */
          deleteCookie('amount');
          isRequested.current = true;

          // 주문스토어 주문,배송비정보 리셋
          resetOrder();
          resetShippingData();
          resetShopNames();

          // 주문완료페이지로 이동
          const { orderId } = res;
          router.push(`/payment/receipt?orderId=${orderId}&orderCode=${orderCode}`);
        })
        .catch((err) => {
          /** 결제 -> 주문 생성 과정 중 오류가 발생한 부분에 따라 다른 오류메시지를 표시함 */
          console.error(err);
          console.error(err.response?.data?.message);
          const message = `${err.response?.data?.message}`;
          router.push(`/payment/fail?message=${message}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCode, paymentKey, redirectAmount]);

  return (
    <KkshowLayout navbarFirstLink="kkmarket">
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
