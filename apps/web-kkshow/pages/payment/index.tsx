import { useEffect } from 'react';
import { Grid, GridItem, Flex } from '@chakra-ui/react';
import {
  PaymentBox,
  MobilePaymentBox,
} from '@project-lc/components-web-kkshow/payment/PaymentBox';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { BuyerInfoSection } from '@project-lc/components-web-kkshow/payment/BuyerInfoSection';
import { DestinationInfo } from '@project-lc/components-web-kkshow/payment/DestinationInfo';
import { GiftBox } from '@project-lc/components-web-kkshow/payment/GiftBox';
import {
  OrderItemInfo,
  MobileOrderItemInfo,
} from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import { useDisplaySize, useProfile } from '@project-lc/hooks';
import { DiscountBox } from '@project-lc/components-web-kkshow/payment/DiscountBox';
import { useForm, FormProvider } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useRouter } from 'next/router';

const dummyOrder = [
  {
    id: 1,
    sellerId: 1,
    shopName: '가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜',
    consumer_price: 19200,
    image: 'https://picsum.photos/300/300',
    option_title: '매운맛',
    number: 1,
    shipping_cost: 3000,
  },
  {
    id: 2,
    sellerId: 1,
    shopName: '가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 된장찌개 김치찜',
    consumer_price: 39200,
    image: 'https://picsum.photos/300/301',
    option_title: '간장맛',
    number: 2,
    shipping_cost: 3000,
  },
];

export function Payment(): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
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
      couponId: 0,
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
        {isDesktopSize ? (
          <Flex m="auto" p={6} alignItems="center" justifyContent="center">
            <Grid templateColumns="repeat(7, 4fr)" gap={6} w="70%">
              <GridItem colSpan={5}>
                <BuyerInfoSection />
              </GridItem>
              <GridItem
                rowSpan={4}
                colSpan={2}
                borderLeft="1px solid"
                borderLeftColor="gray.300"
              >
                <PaymentBox data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={5}>
                {purchaseType === 'gift' ? <GiftBox /> : <DestinationInfo />}
              </GridItem>
              <GridItem colSpan={5}>
                <OrderItemInfo data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={5}>
                <DiscountBox />
              </GridItem>
            </Grid>
          </Flex>
        ) : (
          <Flex m="auto" p={6}>
            <Grid templateColumns="repeat(7, 4fr)" gap={6}>
              <GridItem colSpan={7}>
                <BuyerInfoSection />
              </GridItem>
              <GridItem colSpan={7}>
                {purchaseType === 'gift' ? <GiftBox /> : <DestinationInfo />}
              </GridItem>
              <GridItem colSpan={7}>
                <MobileOrderItemInfo data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={7}>
                <DiscountBox />
              </GridItem>
              <GridItem colSpan={7} rowSpan={1}>
                <MobilePaymentBox />
              </GridItem>
            </Grid>
          </Flex>
        )}
      </FormProvider>
    </KkshowLayout>
  );
}

export default Payment;
