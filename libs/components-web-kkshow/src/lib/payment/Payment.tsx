import { Box, Button, Center, Divider, Flex, Spinner, Text } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useDefaultMileageSetting } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { KkshowSubNavbarHeight } from '../KkshowSubNavbar';
import { TermBox } from './TermBox';

export function getOrderPrice(
  originalPrice: number,
  shippingCost: number,
  discount: number,
  mileageDiscount: number,
  couponDiscount: number,
): number {
  return originalPrice + shippingCost - discount - mileageDiscount - couponDiscount;
}
export function MileageBenefit({
  productPrice,
  mileage,
}: {
  productPrice: number;
  /** 사용한 마일리지 */
  mileage?: number;
}): JSX.Element {
  const { data: mileageSettingData, isLoading } = useDefaultMileageSetting();
  if (isLoading) return <Spinner />;
  if (
    !mileageSettingData ||
    // 전역 마일리지 설정에서 마일리지 기능 사용하지 않거나
    !mileageSettingData.useMileageFeature ||
    // 마일리지 기능을 사용하지만, 마일리지 적립방식이 onPaymentWithoutMileageUse(마일리지 사용시 적립x)이고 마일리지를 사용한 경우
    (mileageSettingData.useMileageFeature &&
      mileage &&
      mileageSettingData.mileageStrategy === 'onPaymentWithoutMileageUse')
  ) {
    return (
      <Flex justifyContent="space-between" h="60px" alignItems="center">
        <Text>적립 혜택이 없습니다</Text>
      </Flex>
    );
  }
  return (
    <Flex justifyContent="space-between" h="60px" alignItems="center">
      <Box>
        <Text as="span" fontWeight="bold">
          {mileageSettingData.mileageStrategy === 'onPaymentPrice' &&
            (
              productPrice *
              (mileageSettingData.defaultMileagePercent * 0.01)
            ).toLocaleString()}
          {(mileageSettingData.mileageStrategy === 'onPaymentPriceExceptMileageUsage' ||
            (mileageSettingData.mileageStrategy === 'onPaymentWithoutMileageUse' &&
              !mileage)) &&
            (
              (productPrice - (mileage || 0)) *
              (mileageSettingData.defaultMileagePercent * 0.01)
            ).toLocaleString()}
        </Text>
        <Text as="span">원 적립예정</Text>
      </Box>
    </Flex>
  );
}

export function PaymentBox(): JSX.Element {
  const { data: mileageSettingData } = useDefaultMileageSetting();
  const { order, shipping, shopNames } = useKkshowOrderStore();

  const PRODUCT_PRICE =
    order.orderItems
      .flatMap((item) => item.options)
      .map((opt) => Number(opt.normalPrice) * opt.quantity)
      .reduce((s, a) => s + Number(a), 0) || 0;

  const productDiscountedPrice =
    order.orderItems
      .flatMap((item) => item.options)
      .map((opt) => Number(opt.discountPrice) * opt.quantity)
      .reduce((s, a) => s + Number(a), 0) || 0;

  const DISCOUNT = PRODUCT_PRICE - productDiscountedPrice;

  // orderItem.shippingCost 가 아닌 kkshowOrderStore에 저장된 배송비 정보 참조하여 배송비 계산
  const SHIPPING_COST = Object.values(shipping).reduce((prev, curr) => {
    if (!curr.cost) return prev;
    return prev + curr.cost.std + curr.cost.add;
  }, 0);

  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<CreateOrderForm>();

  const noMileageBenefit = !mileageSettingData?.useMileageFeature || !watch('customerId'); // 로그인 안한경우도 적립안됨

  const usedCouponAmount = watch('usedCouponAmount') || 0;
  const usedMileageAmount = watch('usedMileageAmount') || 0;

  // 결제버튼에 표시되는 최종 결제금액
  const orderPrice = useMemo(
    () =>
      getOrderPrice(
        PRODUCT_PRICE,
        SHIPPING_COST,
        DISCOUNT,
        usedCouponAmount,
        usedMileageAmount,
      ),
    [DISCOUNT, PRODUCT_PRICE, SHIPPING_COST, usedCouponAmount, usedMileageAmount],
  );
  return (
    <Box
      px={{ base: 0, lg: 4 }}
      position={{ base: 'static', lg: 'sticky' }}
      top={`${KkshowSubNavbarHeight}px`}
      left="0px"
      right="0px"
    >
      <SectionWithTitle title="적립혜택" disableDivider>
        <Flex justifyContent="space-between" h="60px" alignItems="center">
          {noMileageBenefit ? (
            <Text>적립 혜택이 없습니다</Text>
          ) : (
            <>
              <Box />
              <MileageBenefit
                productPrice={orderPrice}
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
        <Button
          type="submit"
          form="order-payment-form"
          size="lg"
          colorScheme="blue"
          isFullWidth
          isDisabled={isSubmitting}
        >
          {getLocaleNumber(orderPrice)}원 결제하기
        </Button>
      </Center>

      <Box mt={6}>
        <TermBox shopNames={shopNames} />
      </Box>
    </Box>
  );
}
