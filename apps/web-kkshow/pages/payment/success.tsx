import {
  Box,
  Heading,
  Flex,
  Grid,
  GridItem,
  Text,
  Divider,
  Button,
  Center,
} from '@chakra-ui/react';
import { usePaymentMutation, useKkshowOrder } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { SuccessDeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import { OrderItemInfo } from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import dayjs from 'dayjs';
// todo: 주문 연결

// todo: 주문 연결
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

const dummyPaymentResult = {
  mId: 'tvivarepublica',
  version: '1.4',
  transactionKey: '2784BE23D17ACB9E9EF1C9BC6B69A11C',
  paymentKey: '6vdX0wJDpj5mBZ1gQ4YVXWG2kooyX3l2KPoqNbMGOkn9EW7y',
  orderId: '20220512141044840Mhrqc3',
  orderName: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜 김피탕 외 1개',
  method: '카드',
  status: 'DONE',
  requestedAt: '2022-05-12T14:10:44+09:00',
  approvedAt: '2022-05-12T14:11:07+09:00',
  useEscrow: false,
  cultureExpense: false,
  card: {
    company: '삼성',
    number: '536648******7695',
    installmentPlanMonths: 0,
    isInterestFree: false,
    interestPayer: null,
    approveNo: '00000000',
    useCardPoint: false,
    cardType: '신용',
    ownerType: '개인',
    acquireStatus: 'READY',
    receiptUrl:
      'https://dashboard.tosspayments.com/sales-slip?transactionId=5LqI2RFJ3n8L7ZzpeSi6b6IYSKvcimRy%2F7hxllit1EGw%2BxgjOJpa4EetcSILgM4l&ref=PX',
    provider: null,
  },
  virtualAccount: null,
  transfer: null,
  mobilePhone: null,
  giftCertificate: null,
  cashReceipt: null,
  discount: null,
  cancels: null,
  secret: 'ps_5mBZ1gQ4YVXWG2xXQM13l2KPoqNb',
  type: 'NORMAL',
  easyPay: null,
  country: 'KR',
  failure: null,
  isPartialCancelable: true,
  currency: 'KRW',
  totalAmount: 61400,
  balanceAmount: 61400,
  suppliedAmount: 55818,
  vat: 5582,
  taxFreeAmount: 0,
};

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
export function Success(): JSX.Element {
  const router = useRouter();

  const [isRequested, setIsRequested] = useState(false);

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

  console.log(productOriginPrice);

  const { mutateAsync } = usePaymentMutation();
  const { data } = useKkshowOrder(orderId || '');

  console.log(data);

  useEffect(() => {
    if (orderId && paymentKey && redirectAmount && !isRequested) {
      // requestPayment(orderId, paymentKey, Number(redirectAmount));
      mutateAsync({
        orderId,
        paymentKey,
        amount: redirectAmount,
      }).then((res) => {
        console.log(res);
      });
      setIsRequested(true);
    }
  }, [orderId, paymentKey, redirectAmount]);

  return (
    <KkshowLayout>
      <Flex m="auto" alignItems="center" justifyContent="center" direction="column">
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
          <GridItem colSpan={3} borderLeft="solid 1px" borderLeftColor="gray.300" pl={2}>
            <Flex justifyContent="space-between" mb={5}>
              <Text fontSize="xl">결제금액</Text>
              <Text fontSize="xl" fontWeight="bold">
                {dummyPaymentResult.totalAmount.toLocaleString()}
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
              <Text>- {dummyOrderResult.customerMileageLog.amount.toLocaleString()}</Text>
            </Flex>
            <Divider mt={2} mb={2} />
            <Flex justifyContent="space-between">
              <Box fontSize="xs">
                <Text>{dummyPaymentResult.card.company}</Text>
                <Text>{dummyPaymentResult.card.number}</Text>
                <Divider m={1} />
                <Text>승인일시</Text>
                <Text>
                  {dayjs(dummyPaymentResult.approvedAt).format('YYYY-m-D HH:mm:ss')}
                </Text>
              </Box>
              {dummyPaymentResult.card.installmentPlanMonths === 0 ? (
                <Text>일시불</Text>
              ) : (
                <Text>{dummyPaymentResult.card.installmentPlanMonths}개월 할부</Text>
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
      </Flex>
    </KkshowLayout>
  );
}

export default Success;
