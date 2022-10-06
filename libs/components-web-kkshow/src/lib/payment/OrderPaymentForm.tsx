import { Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import {
  useCustomerAddressMutation,
  useCustomerInfo,
  useDefaultCustomerAddress,
  useProfile,
} from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useCartStore, useKkshowOrderStore } from '@project-lc/stores';
import { getCustomerWebHost } from '@project-lc/utils';
import { pushDataLayer, setCookie } from '@project-lc/utils-frontend';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { BuyerInfo } from './BuyerInfo';
import { DeliveryAddress } from './DeliveryAddress';
import { Discount } from './Discount';
import { GiftBox } from './Gift';
import { OrderItemInfo } from './OrderItemInfo';
import { getOrderPrice, PaymentBox } from './Payment';
import PaymentNotice from './PaymentNotice';
import { PaymentSelection } from './PaymentSelection';

export async function doPayment(
  paymentType: '카드' | '계좌이체' | '가상계좌' | '미선택',
  client_key: string,
  amount: number,
  productName: string,
  customerName: string,
): Promise<void> {
  return loadTossPayments(client_key)
    .then((tossPayments) => {
      return tossPayments.requestPayment(paymentType, {
        amount,
        orderId: `${dayjs().format('YYYYMMDDHHmmssSSS')}${nanoid(6)}`,
        orderName: `${productName}`,
        customerName,
        successUrl: `${getCustomerWebHost()}/payment/success`,
        failUrl: `${getCustomerWebHost()}/payment/fail`,
      });
    })
    .catch((err) => {
      console.error('Error - loadTossPayments');
      console.error(err);
    });
}

export function OrderPaymentForm(): JSX.Element | null {
  const { data: profile } = useProfile();
  const { data: customer } = useCustomerInfo(profile?.id);
  const orderPrepareData = useKkshowOrderStore((s) => s.order);

  // ga4 전자상거래 begin_checkout 이벤트 https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#begin_checkout
  useEffect(() => {
    if (orderPrepareData) {
      const { orderItems, orderPrice } = orderPrepareData;
      const items = orderItems.flatMap((goods) => {
        return goods.options.map((opt) => ({
          item_id: `${goods.goodsId}`,
          item_name: goods.goodsName,
          price: opt.discountPrice,
          quantity: opt.quantity,
          item_variant: opt.value,
        }));
      });

      pushDataLayer({
        event: 'begin_checkout',
        ecommerce: {
          value: Number(orderPrice), // 쿠폰, 적립금사용 등이 적용되지 않은 주문금액
          currency: 'KRW',
          items,
        },
      });
    }
  }, [orderPrepareData]);

  const methods = useForm<CreateOrderForm>({
    mode: 'onChange',
    defaultValues: {
      ...orderPrepareData,
      customerId: profile?.id,
      ordererName: profile?.name || '',
      ordererEmail: profile?.email || '',
    },
  });

  const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!;
  const { paymentType, order, shipping, handleOrderPrepare } = useKkshowOrderStore();
  const { selectedItems } = useCartStore();
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

  const { getValues, setValue } = methods;

  const { data: defaultAddr } = useDefaultCustomerAddress(customer?.id);
  const { mutateAsync: createAddress } = useCustomerAddressMutation();

  // 로그인하여 소비자 정보가 있는경우 id등 기타 정보 저장
  useEffect(() => {
    if (profile) {
      setValue('customerId', profile?.id);
      setValue('ordererName', profile?.name || '');
      setValue('ordererEmail', profile?.email || '');
    }
  }, [profile, setValue]);

  // * submit => doPayment 실행(success 혹은 fail로 리다이렉트 됨)
  const onSubmit: SubmitHandler<CreateOrderForm> = async (submitData) => {
    const {
      ordererPhone1,
      ordererPhone2,
      ordererPhone3,
      recipientPhone1,
      recipientPhone2,
      recipientPhone3,
      orderItems,
      ...rest
    } = submitData;
    // * 주문 생성에 필요한 데이터를 formState에서 가져와 store에 저장
    const recipientPhone = [recipientPhone1, recipientPhone2, recipientPhone3].join('-');
    const ordererPhone = [ordererPhone1, ordererPhone2, ordererPhone3].join('-');

    handleOrderPrepare({
      ...rest,
      cartItemIdList: selectedItems,
      customerId: profile?.id,
      recipientPhone,
      ordererPhone,
      nonMemberOrderFlag: !profile?.id,
      orderItems: orderItems.map((oi) => ({
        ...oi,
        support: oi.support
          ? {
              ...oi.support,
              broadcasterId: oi.support?.broadcasterId || null,
            }
          : undefined,
      })),
    });
    const amount = getOrderPrice(
      PRODUCT_PRICE,
      SHIPPING_COST,
      DISCOUNT,
      getValues('usedMileageAmount') || 0,
      getValues('usedCouponAmount') || 0,
    );
    const cookieExpire = new Date();
    cookieExpire.setMinutes(cookieExpire.getMinutes() + 5);
    setCookie('amount', amount, { expire: cookieExpire, path: '/' }); // path 설정 안하면 /payment로 저장되기는 함. 이유는 모르겠으나 한번은 path가 /goods로 저장되어 /payment페이지에서 쿠키가 읽히지 않음 -> 결제금액 비교 못하는 문제가 발생하여 '/' 로 저장함

    // 현재 배송지 기본 배송지로 등록 요청 (백그라운드로 요청만 보낼것이므로 await 처리하지 않음.)
    if (customer && !defaultAddr) {
      createAddress({
        title: '기본',
        isDefault: true,
        address: submitData.recipientAddress,
        detailAddress: submitData.recipientDetailAddress,
        customerId: customer?.id,
        phone: recipientPhone.replace(/-/g, ''),
        postalCode: submitData.recipientPostalCode,
        recipient: submitData.recipientName,
        memo: submitData.memo,
      });
    }

    return doPayment(
      paymentType,
      CLIENT_KEY,
      amount,
      productName,
      getValues('ordererName'),
    );
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
        as="form"
        id="order-payment-form"
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
