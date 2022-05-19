import { Box, Button, Center, Divider, Flex, Text, useToast } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { CreateOrderForm } from '@project-lc/shared-types';
import { getLocaleNumber, setCookie } from '@project-lc/utils-frontend';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import { useKkshowOrderStore } from '@project-lc/stores';
import { getCustomerWebHost } from '@project-lc/utils';
import { TermBox } from './TermBox';

const mileageSetting = {
  defaultMileagePercent: 10,
  mileageStrategy: 'onPaymentPrice',
};

function getOrderPrice(
  originalPrice: number,
  shippingCost: number,
  discount: number,
  mileageDiscount: number,
  couponDiscount: number,
): number {
  return originalPrice + shippingCost - discount - mileageDiscount - couponDiscount;
}

async function doPayment(
  paymentType: '카드' | '계좌이체' | '가상계좌' | '미선택',
  client_key: string,
  amount: number,
  productName: string,
  customerName: string,
): Promise<void> {
  return loadTossPayments(client_key).then((tossPayments) => {
    tossPayments.requestPayment(paymentType, {
      amount,
      orderId: `${dayjs().format('YYYYMMDDHHmmssSSS')}${nanoid(6)}`,
      orderName: `${productName}`,
      customerName,
      successUrl: `${getCustomerWebHost()}/payment/success`,
      failUrl: `${getCustomerWebHost()}/payment/fail`,
    });
  });
}

export function MileageBenefit({
  productPrice,
  mileage,
}: {
  productPrice: number;
  mileage?: number;
}): JSX.Element {
  // TODO: 마일리지 crud 일감 이후 디비에서 불러오도록 수정 필요
  return (
    <Flex justifyContent="space-between" h="60px" alignItems="center">
      {mileageSetting.mileageStrategy === 'noMileage' ? (
        <Text>적립 혜택이 없습니다</Text>
      ) : (
        <Box>
          <Text as="span" fontWeight="bold">
            {mileageSetting.mileageStrategy === 'onPaymentPrice' &&
              (
                productPrice *
                (mileageSetting.defaultMileagePercent * 0.01)
              ).toLocaleString()}
            {mileageSetting.mileageStrategy === 'onPaymentPriceExceptMileageUsage' &&
              (
                (productPrice - (mileage || 0)) *
                (mileageSetting.defaultMileagePercent * 0.01)
              ).toLocaleString()}
          </Text>
          <Text as="span">원 적립예정</Text>
        </Box>
      )}
    </Flex>
  );
}

export function PaymentBox(): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  const { paymentType, order } = useKkshowOrderStore();
  const toast = useToast();
  const PRODUCT_PRICE = order.orderPrice;
  const SHIPPING_COST = order.orderItems.reduce(
    (prev, curr) => prev + Number(curr.shippingCost),
    0,
  );
  const productNameArray = order.orderItems.map((item) => item.goodsName);
  const DISCOUNT = 3000;
  let productName = '';
  if (productNameArray.length > 1) {
    productName = `${productNameArray[0]} 외 ${productNameArray.length - 1}개`;
  } else if (productNameArray.length === 1) {
    productName = productNameArray[0] || '';
  }

  const { handleSubmit, watch, getValues } = useFormContext<CreateOrderForm>();
  const onSubmit: SubmitHandler<CreateOrderForm> = async (submitData) => {
    if (paymentType === '미선택') {
      toast({
        title: '결제수단을 선택해주세요',
        status: 'error',
        position: 'top',
      });
    } else {
      console.log(submitData);
      const amount = getOrderPrice(
        PRODUCT_PRICE,
        SHIPPING_COST,
        DISCOUNT,
        getValues('usedMileageAmount') || 0,
        getValues('usedCouponAmount') || 0,
      );
      const cookieExpire = new Date();
      cookieExpire.setMinutes(cookieExpire.getMinutes() + 1);
      setCookie('amount', amount, { expire: cookieExpire });
      // doPayment(paymentType, CLIENT_KEY, amount, productName, getValues('name'));
      await doPayment(
        paymentType,
        CLIENT_KEY,
        amount,
        productName,
        getValues('ordererName'),
      );
      console.log('payment done');
    }
  };

  return (
    <Box
      px={{ base: 0, lg: 4 }}
      position={{ base: 'static', lg: 'sticky' }}
      top="0px"
      left="0px"
      right="0px"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <SectionWithTitle title="적립혜택" disableDivider>
        <Flex justifyContent="space-between" h="60px" alignItems="center">
          {mileageSetting.mileageStrategy === 'noMileage' ? (
            <Text>적립 혜택이 없습니다</Text>
          ) : (
            <>
              <Box />
              <MileageBenefit
                productPrice={PRODUCT_PRICE}
                mileage={watch('usedMileageAmount')}
              />
            </>
          )}
        </Flex>
      </SectionWithTitle>

      <SectionWithTitle title="결제 예정 금액" disableDivider>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>상품금액</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              {getLocaleNumber(PRODUCT_PRICE)}
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>배송비 (선결제)</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              {`+ ${getLocaleNumber(SHIPPING_COST)}`}
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>할인금액</Text>
          <Box>
            <Text fontWeight="bold" color="red" fontSize="xl" as="span">
              {`- ${getLocaleNumber(DISCOUNT)}`}
            </Text>
            <Text color="red" as="span">
              원
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>적립금 사용</Text>
          <Box>
            <Text fontWeight="bold" color="red" fontSize="xl" as="span">
              {`- ${getLocaleNumber(watch('usedMileageAmount') || 0)}`}
            </Text>
            <Text color="red" as="span">
              원
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>쿠폰 사용</Text>
          <Box>
            <Text fontWeight="bold" color="red" fontSize="xl" as="span">
              {`- ${getLocaleNumber(watch('usedCouponAmount') || 0)}`}
            </Text>
            <Text color="red" as="span">
              원
            </Text>
          </Box>
        </Flex>
      </SectionWithTitle>
      <Divider m={2} />
      <Box mb={5}>
        <Text as="sub">하기 필수약관을 확인하였으며, 이에 동의합니다.</Text>
      </Box>
      <Center>
        <Button type="submit" size="lg" colorScheme="blue" isFullWidth>
          {getLocaleNumber(
            getOrderPrice(
              PRODUCT_PRICE,
              SHIPPING_COST,
              DISCOUNT,
              watch('usedCouponAmount') || 0,
              watch('usedMileageAmount') || 0,
            ),
          )}
          원 결제하기
        </Button>
      </Center>

      <Box mt={6}>
        <TermBox shopName="테스트" />
      </Box>
    </Box>
  );
}
