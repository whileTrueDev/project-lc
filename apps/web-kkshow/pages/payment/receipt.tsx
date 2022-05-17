import {
  Box,
  Heading,
  Flex,
  Grid,
  GridItem,
  Text,
  Divider,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDisplaySize, usePaymentByOrderId } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { SuccessDeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import {
  OrderItemInfo,
  MobileOrderItemInfo,
} from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
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

export function Receipt(): JSX.Element {
  const router = useRouter();
  const { isDesktopSize } = useDisplaySize();
  const orderId = router.query.orderId as string;
  const { data: paymentData, isLoading } = usePaymentByOrderId(orderId);
  const virtualAccountBoxBgColor = useColorModeValue('gray.100', 'gray.700');

  const productOriginPrice = dummyOrderResult.orderItems[0].options.reduce(
    (s, a) => s + Number(a.normalPrice),
    0,
  );

  const productDiscountedPrice = dummyOrderResult.orderItems[0].options.reduce(
    (s, a) => s + Number(a.discountPrice),
    0,
  );

  const discount = productOriginPrice - productDiscountedPrice;

  // todo: 주문 연결 이후, dummyOrderResult 대신 이 데이터로 사용
  // const { data: orderData } = useKkshowOrder(orderId || '');

  return (
    <KkshowLayout>
      <Flex m="auto" alignItems="center" justifyContent="center" direction="column" p={2}>
        {!isLoading && paymentData && (
          <Grid
            templateColumns="repeat(7, 5fr)"
            gap={6}
            w={{ base: '100%', md: '45%' }}
            m={10}
          >
            <GridItem colSpan={7}>
              <Flex direction="column" alignItems="center" justifyContent="center" p={2}>
                {isDesktopSize ? (
                  <Heading m={10}>주문이 정상적으로 완료되었습니다</Heading>
                ) : (
                  <Heading>주문 완료</Heading>
                )}
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              {paymentData.virtualAccount && (
                <Flex direction="column">
                  <Flex mb={5} direction="column">
                    <Heading size="lg">가상계좌 입금정보</Heading>
                    <Text fontSize="sm">
                      * 입금기한까지 입금되지 않으면, 주문이 취소됩니다.
                    </Text>
                  </Flex>
                  <Box bg={virtualAccountBoxBgColor} p={5} borderRadius="10px">
                    <Flex justifyContent="space-between">
                      <Text>입금액</Text>
                      <Text fontWeight="bold">
                        {paymentData.totalAmount.toLocaleString()}원
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금 계좌번호</Text>
                      <Text fontWeight="bold">
                        {paymentData.virtualAccount.accountNumber}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금은행</Text>
                      <Text fontWeight="bold">{paymentData.virtualAccount.bank}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금기한</Text>
                      <Text fontWeight="bold">
                        {dayjs(paymentData.virtualAccount.dueDate).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )}
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
              <Flex
                justifyContent="space-between"
                alignItems="flex-end"
                mb={5}
                direction="column"
              >
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
              {paymentData.card && (
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
              )}
              {paymentData.transfer && (
                <>
                  <Flex justifyContent="space-between">
                    <Text>결제수단</Text>
                    <Text>계좌이체</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>은행</Text>
                    <Text>{paymentData.transfer.bank}</Text>
                  </Flex>
                </>
              )}
            </GridItem>
            <GridItem colSpan={7}>
              {isDesktopSize ? (
                <OrderItemInfo data={dummyOrder} />
              ) : (
                <MobileOrderItemInfo data={dummyOrder} />
              )}
            </GridItem>
            <GridItem colSpan={7}>
              <Flex alignContent="center" justifyContent="center" mt="10%" mb="10%">
                <Flex justifyContent="space-around" w={{ base: '80%', md: '40%' }}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push('/mypage');
                    }}
                  >
                    주문 상세보기
                  </Button>
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

export default Receipt;
