import {
  Box,
  Heading,
  Flex,
  Grid,
  GridItem,
  Text,
  Divider,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { usePaymentMutation, useKkshowOrder } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Payment } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { SuccessDeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import { OrderItemInfo } from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import dayjs from 'dayjs';

// todo: 주문 연결 이후 주문 데이터로 변경
const dummyOrder = [
  {
    id: 1,
    sellerId: 1,
    shopName: '가게가게가가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜 김피탕',
    consumer_price: 19200,
    image: 'https://picsum.photos/300/300',
    option_title: '매운맛',
    number: 1,
    shipping_cost: 3000,
  },
  {
    id: 2,
    sellerId: 1,
    shopName: '가게가게가가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 된장찌개 김치찜',
    consumer_price: 39200,
    image: 'https://picsum.photos/300/301',
    option_title: '간장맛',
    number: 2,
    shipping_cost: 3000,
  },
];

// todo: 주문 연결 이후 주문 데이터로 변경
const dummyOrderResult = {
  id: 1,
  orderCode: '20220512100923053IMXrXw',
  customerId: 1,
  step: 'orderReceived',
  createDate: '2022-05-11T00:54:08.579Z',
  orderPrice: 123123,
  paymentPrice: 0,
  recipientName: '받는사람이름',
  recipientPhone: '01023232323',
  recipientEmail: 'reccipient@gasdf.com',
  recipientAddress: '서울특별시 종로구 무슨로 13',
  recipientDetailAddress: '494호',
  recipientPostalCode: '1234',
  ordererName: '주문자이름',
  ordererPhone: '01020234848',
  ordererEmail: 'orderer@gmao.com',
  memo: '빠른배송요망',
  nonMemberOrderFlag: false,
  nonMemberOrderPassword: null,
  giftFlag: false,
  supportOrderIncludeFlag: false,
  bundleFlag: false,
  purchaseConfirmationDate: null,
  cashReceipts: null,
  deleteFlag: false,
  payment: null,
  customerCouponLogs: {
    id: 1,
    customerCouponId: 1,
    type: 'used',
    orderId: 1,
    customerCoupon: {
      id: 1,
      couponId: 1,
      customerId: 1,
      status: 'used',
      coupon: {
        id: 1,
        amount: 2000,
        unit: 'P',
      },
    },
  },
  customerMileageLog: {
    id: 1,
    customerId: 1,
    amount: 2000,
    actionType: 'consume',
  },
  orderItems: [
    {
      id: 1,
      orderId: 1,
      goodsId: 1,
      channel: 'normal',
      shippingCost: '0',
      shippingCostIncluded: false,
      shippingGroupId: 1,
      reviewId: null,
      options: [
        {
          id: 1,
          orderItemId: 1,
          goodsOptionId: 1,
          name: '맛',
          value: '매운맛',
          quantity: 1,
          normalPrice: '5000',
          discountPrice: '4000',
          weight: null,
          step: 'orderReceived',
          purchaseConfirmationDate: null,
        },
        {
          id: 2,
          orderItemId: 1,
          goodsOptionId: 2,
          name: '맛',
          value: '순한맛',
          quantity: 1,
          normalPrice: '5000',
          discountPrice: '4000',
          weight: null,
          step: 'orderReceived',
          purchaseConfirmationDate: null,
        },
      ],
      support: null,
      goods: {
        id: 1,
        goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜 ',
        image: [
          {
            id: 1,
            goodsId: 1,
            image: 'https://picsum.photos/301/300',
            cut_number: 0,
          },
          {
            id: 2,
            goodsId: 1,
            image: 'https://picsum.photos/300/300',
            cut_number: 1,
          },
          {
            id: 3,
            goodsId: 1,
            image: 'https://picsum.photos/300/301',
            cut_number: 2,
          },
          {
            id: 4,
            goodsId: 1,
            image: 'https://picsum.photos/301/301',
            cut_number: 3,
          },
          {
            id: 5,
            goodsId: 1,
            image: 'https://picsum.photos/302/301',
            cut_number: 4,
          },
        ],
      },
    },
  ],
  refunds: [],
  returns: [],
  exports: [],
  exchanges: [],
  orderCancellations: [],
};

function getCookie(): number | null {
  const value = document.cookie.match(`(^|;) ?amount=([^;]*)(;|$)`);
  return value ? Number(value[2]) : null;
}

function deleteCookie(): void {
  const date = new Date();
  document.cookie = `amount= ; expires=${date.toUTCString()}; path=/`;
}

// cofs.tistory.com/363 [CofS]

// cofs.tistory.com/363 [CofS]
export function Success(): JSX.Element {
  const router = useRouter();
  const { paymentAmount } = useKkshowOrderStore();

  const [isRequested, setIsRequested] = useState(false);
  const [paymentData, setPaymentData] = useState<Payment>();

  const orderId = router.query.orderId as string;
  const paymentKey = router.query.paymentKey as string;
  const redirectAmount = Number(router.query.amount as string);

  const productOriginPrice = dummyOrderResult.orderItems[0].options.reduce(
    (s, a) => s + Number(a.normalPrice),
    0,
  );

  const productDiscountedPrice = dummyOrderResult.orderItems[0].options.reduce(
    (s, a) => s + Number(a.discountPrice),
    0,
  );

  const discount = productOriginPrice - productDiscountedPrice;

  const { mutateAsync } = usePaymentMutation();
  // todo: 주문 연결 이후, dummyOrderResult 대신 이 데이터로 사용
  const { data: orderData } = useKkshowOrder(orderId || '');

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
        setPaymentData(item);
      });
      deleteCookie();
      setIsRequested(true);
    } else if (
      orderId &&
      paymentKey &&
      redirectAmount &&
      !isRequested &&
      redirectAmount !== tossPaymentsAmount
    ) {
      router.push('/fail?message=결제금액 오류');
    }
  }, [orderId, paymentKey, redirectAmount]);

  return (
    <KkshowLayout>
      <Flex m="auto" alignItems="center" justifyContent="center" direction="column">
        {!paymentData && (
          <Flex alignItems="center" justifyContent="center" direction="column" h="2xl">
            <Spinner mb={10} />
            <Heading>주문 처리가 진행중입니다</Heading>
          </Flex>
        )}
        {paymentData && (
          <Grid templateColumns="repeat(7, 4fr)" gap={6} w="45%" m={10}>
            <GridItem colSpan={7}>
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                p={2}
                m={10}
              >
                <Heading>주문이 정상적으로 완료되었습니다</Heading>
              </Flex>
            </GridItem>
            <GridItem colSpan={4}>
              <Heading size="lg">배송지 정보</Heading>
              <SuccessDeliveryAddress />
            </GridItem>
            <GridItem
              colSpan={3}
              borderLeft="solid 1px"
              borderLeftColor="gray.300"
              pl={2}
            >
              <Flex justifyContent="space-between" mb={5}>
                <Text fontSize="xl">결제금액</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {paymentData.totalAmount.toLocaleString()}
                </Text>
              </Flex>
              <Divider />
              <Flex justifyContent="space-between" color="gray.500">
                <Text>상품금액</Text>
                <Text>{productOriginPrice.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>할인</Text>
                <Text>- {discount.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>배송비</Text>
                <Text>
                  + {dummyOrderResult.orderItems[0].shippingCost.toLocaleString()}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>쿠폰사용</Text>
                <Text>
                  -{' '}
                  {dummyOrderResult.customerCouponLogs.customerCoupon.coupon.amount.toLocaleString()}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>적립금사용</Text>
                <Text>
                  - {dummyOrderResult.customerMileageLog.amount.toLocaleString()}
                </Text>
              </Flex>
              <Divider mt={2} mb={2} />
              <Flex justifyContent="space-between">
                <Box fontSize="xs">
                  <Text>{paymentData.card.company}</Text>
                  <Text>{paymentData.card.number}</Text>
                  <Divider m={1} />
                  <Text>승인일시</Text>
                  <Text>
                    {dayjs(paymentData.approvedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Box>
                {paymentData.card.installmentPlanMonths === 0 ? (
                  <Text>일시불</Text>
                ) : (
                  <Text>{paymentData.card.installmentPlanMonths}개월 할부</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              <OrderItemInfo data={dummyOrder} />
            </GridItem>
            <GridItem colSpan={7}>
              <Flex alignContent="center" justifyContent="center" mt="10%" mb="10%">
                <Flex justifyContent="space-around" w="40%">
                  <Button variant="outline">주문 상세보기</Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => {
                      router.push('/shopping');
                    }}
                  >
                    쇼핑 계속하기
                  </Button>
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
        )}
      </Flex>
    </KkshowLayout>
  );
}

export default Success;
