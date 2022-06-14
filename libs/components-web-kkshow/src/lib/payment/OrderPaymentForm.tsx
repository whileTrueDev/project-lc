import { Grid, GridItem, Heading, Stack, useToast, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useCartStore, useKkshowOrderStore } from '@project-lc/stores';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { setCookie } from '@project-lc/utils-frontend';
import { BuyerInfo } from './BuyerInfo';
import { DeliveryAddress } from './DeliveryAddress';
import { Discount } from './Discount';
import { GiftBox } from './Gift';
import { OrderItemInfo } from './OrderItemInfo';
import { PaymentBox, getOrderPrice, doPayment } from './Payment';
import PaymentNotice from './PaymentNotice';
import { PaymentSelection } from './PaymentSelection';

export function OrderPaymentForm(): JSX.Element | null {
  const { data: profile } = useProfile();
  const orderPrepareData = useKkshowOrderStore((s) => s.order);

  const methods = useForm<CreateOrderForm>({
    mode: 'onChange',
    defaultValues: {
      ...orderPrepareData,
      customerId: profile?.id,
      ordererName: profile?.name || '',
      ordererEmail: profile?.email || '',
    },
  });

  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  const { paymentType, order, shipping, handleOrderPrepare } = useKkshowOrderStore();
  const { selectedItems } = useCartStore();
  const toast = useToast();
  const PRODUCT_PRICE = order.orderPrice;
  // orderItem.shippingCost 가 아닌 kkshowOrderStore에 저장된 배송비 정보 참조하여 배송비 계산
  const SHIPPING_COST = Object.values(shipping).reduce((prev, curr) => {
    if (!curr.cost) return prev;
    return prev + curr.cost.std + curr.cost.add;
  }, 0);
  const productNameArray = order.orderItems.map((item) => item.goodsName);
  const DISCOUNT = order.totalDiscount || 0;
  let productName = '';
  if (productNameArray.length > 1) {
    productName = `${productNameArray[0]} 외 ${productNameArray.length - 1}개`;
  } else if (productNameArray.length === 1) {
    productName = productNameArray[0] || '';
  }

  const { getValues } = methods;

  // * submit => doPayment 실행(success 혹은 fail로 리다이렉트 됨)
  const onSubmit: SubmitHandler<CreateOrderForm> = async (submitData) => {
    const {
      ordererPhone1,
      ordererPhone2,
      ordererPhone3,
      recipientPhone1,
      recipientPhone2,
      recipientPhone3,
      ...rest
    } = submitData;
    //
    // * 주문 생성에 필요한 데이터를 formState에서 가져와 store에 저장
    handleOrderPrepare({
      ...rest,
      cartItemIdList: selectedItems,
      customerId: profile?.id,
      recipientPhone: [recipientPhone1, recipientPhone2, recipientPhone3].join('-'),
    });
    if (paymentType === '미선택') {
      toast({
        title: '결제수단을 선택해주세요',
        status: 'error',
        position: 'top',
      });
    } else {
      const amount = getOrderPrice(
        PRODUCT_PRICE,
        SHIPPING_COST,
        DISCOUNT,
        getValues('usedMileageAmount') || 0,
        getValues('usedCouponAmount') || 0,
      );
      const cookieExpire = new Date();
      cookieExpire.setMinutes(cookieExpire.getMinutes() + 1);
      setCookie('amount', amount, { expire: cookieExpire, path: '/' }); // path 설정 안하면 /payment로 저장되기는 함. 이유는 모르겠으나 한번은 path가 /goods로 저장되어 /payment페이지에서 쿠키가 읽히지 않음 -> 결제금액 비교 못하는 문제가 발생하여 '/' 로 저장함

      await doPayment(
        paymentType,
        CLIENT_KEY,
        amount,
        productName,
        getValues('ordererName'),
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <Grid
        maxW="5xl"
        m="auto"
        templateColumns="repeat(7, 1fr)"
        gap={6}
        px={4}
        py={6}
        mb={{ base: 0, lg: 20 }}
        // TODO: form submit 처리를 여기서 진행하도록 수정 (PaymentBox가 아니라)
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <GridItem colSpan={7}>
          <Heading>주문서</Heading>
        </GridItem>

        <GridItem colSpan={{ base: 7, lg: 5 }}>
          <Stack spacing={6}>
            <BuyerInfo />
            {methods.getValues('giftFlag') ? <GiftBox /> : <DeliveryAddress />}
            <OrderItemInfo />
            <Discount />
            <PaymentSelection />
          </Stack>
        </GridItem>

        <GridItem
          colSpan={{ base: 7, lg: 2 }}
          borderLeftWidth={{ base: 'none', lg: 'thin' }}
        >
          <PaymentBox />
        </GridItem>

        <GridItem colSpan={{ base: 7, lg: 5 }}>
          <PaymentNotice />
        </GridItem>
      </Grid>
    </FormProvider>
  );
}

export default OrderPaymentForm;
