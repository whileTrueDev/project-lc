import { Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { BuyerInfo } from '@project-lc/components-web-kkshow/payment/BuyerInfo';
import { DeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import { Discount } from '@project-lc/components-web-kkshow/payment/Discount';
import { GiftBox } from '@project-lc/components-web-kkshow/payment/Gift';
import { OrderItemInfo } from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import { PaymentBox } from '@project-lc/components-web-kkshow/payment/Payment';
import { PaymentNotice } from '@project-lc/components-web-kkshow/payment/PaymentNotice';
import { PaymentSelection } from '@project-lc/components-web-kkshow/payment/PaymentSelection';
import { useProfile } from '@project-lc/hooks';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

// todo: 주문 연결
const dummyOrderGoods = [
  {
    id: 1,
    sellerId: 1,
    shopName: '진국명가',
    goods_name: '만두',
    image: 'https://picsum.photos/300/300',
    shipping_cost: 3000,
    options: [
      {
        optionTitle: '만두 종류',
        optionValue: '왕만두',
        normalPrice: 3000,
        discountPrice: 2500,
        quantity: 3,
      },
      {
        optionTitle: '만두 종류',
        optionValue: '그냥 만두',
        normalPrice: 2000,
        discountPrice: 1500,
        quantity: 1,
      },
    ],
  },
  {
    id: 1,
    sellerId: 1,
    shopName: '진국명가',
    goods_name: '푹 끓인 돼지 김치찌개 (500g)',
    image: 'https://picsum.photos/300/300',
    shipping_cost: 3000,
    options: [
      {
        optionTitle: '맛',
        optionValue: '매운맛',
        normalPrice: 30000,
        discountPrice: 25000,
        quantity: 3,
      },
      {
        optionTitle: '맛',
        optionValue: '안매운맛',
        normalPrice: 20000,
        discountPrice: 15000,
        quantity: 1,
      },
    ],
  },
];

export function Payment(): JSX.Element {
  const { data: profile } = useProfile();
  const router = useRouter();
  const purchaseType = router.query.type;

  const methods = useForm<PaymentPageDto>({
    mode: 'onChange',
    defaultValues: {
      customerId: 0,
      email: '',
      orderPhone: '',
      orderPhone1: '',
      orderPhone2: '',
      orderPhone3: '',
      name: '',
      recipient: '',
      recipientPhone: '',
      postalCode: '',
      address: '',
      detailAddress: '',
      goods_id: 0,
      optionId: 0,
      number: 0,
      shipping_cost: 0,
      mileage: 0,
      couponId: null,
      couponAmount: 0,
      discount: 0,
      orderPrice: 0,
      paymentPrice: 0,
    },
  });

  useEffect(() => {
    methods.setValue('customerId', profile?.id);
    methods.setValue('name', profile?.name);
  }, [methods, profile?.id, profile?.name]);

  return (
    <KkshowLayout>
      <FormProvider {...methods}>
        <Grid
          maxW="5xl"
          m="auto"
          templateColumns="repeat(7, 1fr)"
          gap={6}
          px={4}
          py={6}
          mb={{ base: 0, lg: 20 }}
        >
          <GridItem colSpan={7}>
            <Heading>주문서</Heading>
          </GridItem>

          <GridItem colSpan={{ base: 7, lg: 5 }}>
            <Stack spacing={6}>
              <BuyerInfo />
              {purchaseType === 'gift' ? <GiftBox /> : <DeliveryAddress />}
              {/* <CartTable /> */}
              <OrderItemInfo data={dummyOrder} />
              <Discount />
              <PaymentSelection />
            </Stack>
          </GridItem>

          <GridItem
            colSpan={{ base: 7, lg: 2 }}
            borderLeftWidth={{ base: 'none', lg: 'thin' }}
          >
            <PaymentBox data={dummyOrder} />
          </GridItem>

          <GridItem colSpan={{ base: 7, lg: 5 }}>
            <PaymentNotice />
          </GridItem>
        </Grid>
      </FormProvider>
    </KkshowLayout>
  );
}

export default Payment;
