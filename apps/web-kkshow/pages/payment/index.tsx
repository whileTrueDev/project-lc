import { useEffect } from 'react';
import { Grid, GridItem, Flex, Text } from '@chakra-ui/react';
import {
  PaymentBox,
  MobilePaymentBox,
} from '@project-lc/components-web-kkshow/payment/Payment';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { BuyerInfo } from '@project-lc/components-web-kkshow/payment/BuyerInfo';
import { DeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import { GiftBox } from '@project-lc/components-web-kkshow/payment/Gift';
import {
  OrderItemInfo,
  MobileOrderItemInfo,
} from '@project-lc/components-web-kkshow/payment/OrderItemInfo';
import { useDisplaySize, useProfile } from '@project-lc/hooks';
import { Discount } from '@project-lc/components-web-kkshow/payment/Discount';
import { useForm, FormProvider } from 'react-hook-form';
import { PaymentSelection } from '@project-lc/components-web-kkshow/payment/PaymentSelection';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useRouter } from 'next/router';

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
            <Grid templateColumns="repeat(7, 6fr)" gap={6} w="70%">
              <GridItem colSpan={5}>
                <BuyerInfo />
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
                {purchaseType === 'gift' ? <GiftBox /> : <DeliveryAddress />}
              </GridItem>
              <GridItem colSpan={5}>
                <OrderItemInfo data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={5}>
                <Discount />
              </GridItem>
              <GridItem colSpan={5}>
                <PaymentSelection />
              </GridItem>
              <GridItem colSpan={5}>
                <Text variant="abbr" fontSize="sm">
                  와일트루는 통신판매중개자로서 오픈마켓 크크쇼의 거래당사자가 아니며,
                  입점판매자가 등록한 상품정보 및 거래에 대해 와일트루는 일체 책임을 지지
                  않습니다.
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        ) : (
          <Flex m="auto" p={6}>
            <Grid templateColumns="repeat(7, 6fr)" gap={6}>
              <GridItem colSpan={7}>
                <BuyerInfo />
              </GridItem>
              <GridItem colSpan={7}>
                {purchaseType === 'gift' ? <GiftBox /> : <DeliveryAddress />}
              </GridItem>
              <GridItem colSpan={7}>
                <MobileOrderItemInfo data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={7}>
                <Discount />
              </GridItem>
              <GridItem colSpan={7}>
                <PaymentSelection />
              </GridItem>
              <GridItem colSpan={7} rowSpan={1}>
                <MobilePaymentBox data={dummyOrder} />
              </GridItem>
              <GridItem colSpan={7}>
                <Text variant="abbr" fontSize="sm">
                  와일트루는 통신판매중개자로서 오픈마켓 크크쇼의 거래당사자가 아니며,
                  입점판매자가 등록한 상품정보 및 거래에 대해 와일트루는 일체 책임을 지지
                  않습니다.
                </Text>
              </GridItem>
            </Grid>
          </Flex>
        )}
      </FormProvider>
    </KkshowLayout>
  );
}

export default Payment;
