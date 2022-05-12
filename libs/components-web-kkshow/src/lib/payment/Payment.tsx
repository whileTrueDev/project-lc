import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { getCustomerWebHost } from '@project-lc/utils';
import { TermBox } from './TermBox';

interface DummyOrder {
  id: number;
  sellerId: number;
  shopName: string;
  goods_name: string;
  consumer_price: number;
  image: string;
  option_title: string;
  number: number;
  shipping_cost: number;
}

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
  price: number,
  shipping_cost: number,
  discount: number,
  mileage: number,
  coupon: number,
  productName: string,
  customerName: string,
): Promise<void> {
  loadTossPayments(client_key).then((tossPayments) => {
    tossPayments.requestPayment(paymentType, {
      amount: getOrderPrice(price, shipping_cost, discount, mileage, coupon),
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
  mileage: number;
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
                (productPrice - mileage) *
                (mileageSetting.defaultMileagePercent * 0.01)
              ).toLocaleString()}
          </Text>
          <Text as="span">원 적립예정</Text>
        </Box>
      )}
    </Flex>
  );
}

export function PaymentBox({ data }: { data: DummyOrder[] }): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  const { paymentType } = useKkshowOrderStore();
  const toast = useToast();
  /** 상품상세페이지와 연결 이후, goods로부터 정보 가져오도록 변경 */
  const PRODUCT_PRICE = data
    .map((item) => item.consumer_price)
    .reduce((prev: number, curr: number) => prev + curr, 0);
  const SHIPPING_COST = data
    .map((item) => item.shipping_cost)
    .reduce((prev: number, curr: number) => prev + curr, 0);
  const DISCOUNT = 3000;
  const productNameArray = data.map((item) => item.goods_name);
  let productName = '';

  if (productNameArray.length > 1) {
    productName = `${productNameArray[0]} 외 ${productNameArray.length - 1}개`;
  } else if (productNameArray.length === 1) {
    [productName] = productNameArray;
  }

  const { handleSubmit, watch, getValues } = useFormContext<PaymentPageDto>();
  const onSubmit: SubmitHandler<PaymentPageDto> = () => {
    if (paymentType === '미선택') {
      toast({
        title: '결제수단을 선택해주세요',
        status: 'error',
        position: 'top',
      });
    } else {
      // ToDO: 주문연결이후 지우기
      console.log(
        getValues('customerId'),
        getValues('name'),
        getValues('recipient'),
        `${getValues('recipientPhone1')} - ${getValues('recipientPhone2')} - ${getValues(
          'recipientPhone3',
        )}`,
        getValues('postalCode'),
        getValues('address'),
        getValues('detailAddress'),
        getValues('goods_id'),
        getValues('optionId'),
        getValues('number'),
        getValues('shipping_cost'),
        getValues('mileage'),
        getValues('couponId'),
        getValues('couponAmount'),
        getValues('discount'),
      );
      doPayment(
        paymentType,
        CLIENT_KEY,
        PRODUCT_PRICE,
        SHIPPING_COST,
        DISCOUNT,
        getValues('mileage'),
        getValues('couponAmount'),
        productName,
        getValues('name'),
      );
    }
  };

  return (
    <Box
      p={4}
      h="2xl"
      position="sticky"
      top="0px"
      left="0px"
      right="0px"
      backgroundColor={useColorModeValue('white', 'gray.800')}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading size="lg">적립혜택</Heading>
      <Flex justifyContent="space-between" h="60px" alignItems="center">
        {mileageSetting.mileageStrategy === 'noMileage' ? (
          <Text>적립 혜택이 없습니다</Text>
        ) : (
          <>
            <Box />
            <MileageBenefit productPrice={PRODUCT_PRICE} mileage={watch('mileage')} />
          </>
        )}
      </Flex>
      <Divider mt={5} mb={5} />
      <Heading size="lg">결제 예정 금액</Heading>
      <Divider m={2} />
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>상품금액</Text>
        <Box>
          <Text fontWeight="bold" fontSize="xl" as="span">
            {PRODUCT_PRICE.toLocaleString()}
          </Text>
          <Text as="span">원</Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>배송비 (선결제)</Text>
        <Box>
          <Text fontWeight="bold" fontSize="xl" as="span">
            {`+ ${SHIPPING_COST.toLocaleString()}`}
          </Text>
          <Text as="span">원</Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>할인금액</Text>
        <Box>
          <Text fontWeight="bold" color="red" fontSize="xl" as="span">
            {`- ${DISCOUNT.toLocaleString()}`}
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
            {`- ${watch('mileage').toLocaleString() || 0}`}
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
            {`- ${watch('couponAmount').toLocaleString() || 0}`}
          </Text>
          <Text color="red" as="span">
            원
          </Text>
        </Box>
      </Flex>
      <Divider m={2} />
      <Box mb={5}>
        <Text as="sub">하기 필수약관을 확인하였으며, 이에 동의합니다.</Text>
      </Box>
      <Center>
        <Button type="submit" size="lg" colorScheme="blue">
          {getOrderPrice(
            PRODUCT_PRICE,
            SHIPPING_COST,
            DISCOUNT,
            watch('couponAmount'),
            watch('mileage'),
          ).toLocaleString()}
          원 결제하기
        </Button>
      </Center>
      <Box mt={6}>
        <TermBox shopName={data[0].shopName} />
      </Box>
    </Box>
  );
}

export function MobilePaymentBox({ data }: { data: DummyOrder[] }): JSX.Element {
  const { watch, getValues, handleSubmit } = useFormContext<PaymentPageDto>();
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  const { paymentType } = useKkshowOrderStore();
  const toast = useToast();
  /** 상품상세페이지와 연결 이후, goods로부터 정보 가져오도록 변경 */
  const PRODUCT_PRICE = 19000;
  const SHIPPING_COST = 3000;
  const DISCOUNT = 3000;

  const productNameArray = data.map((item) => item.goods_name);
  let productName = '';

  if (productNameArray.length > 1) {
    productName = `${productNameArray[0]} 외 ${productNameArray.length - 1}개`;
  } else if (productNameArray.length === 1) {
    [productName] = productNameArray;
  }

  const onSubmit: SubmitHandler<PaymentPageDto> = () => {
    if (paymentType === '미선택') {
      toast({
        title: '결제수단을 선택해주세요',
        status: 'error',
      });
    } else {
      // todo: 주문연결이후 지우기
      console.log(
        getValues('customerId'),
        getValues('name'),
        getValues('recipient'),
        `${getValues('recipientPhone1')} - ${getValues('recipientPhone2')} - ${getValues(
          'recipientPhone3',
        )}`,
        getValues('postalCode'),
        getValues('address'),
        getValues('detailAddress'),
        getValues('goods_id'),
        getValues('optionId'),
        getValues('number'),
        getValues('shipping_cost'),
        getValues('mileage'),
        getValues('couponId'),
        getValues('couponAmount'),
        getValues('discount'),
      );
      doPayment(
        paymentType,
        CLIENT_KEY,
        PRODUCT_PRICE,
        SHIPPING_COST,
        DISCOUNT,
        getValues('mileage'),
        getValues('couponAmount'),
        productName,
        getValues('name'),
      );
    }
  };
  return (
    <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading size="lg">적립혜택</Heading>
      <Flex justifyContent="space-between" h="60px" alignItems="center">
        {mileageSetting.mileageStrategy === 'noMileage' ? (
          <Text>적립 혜택이 없습니다</Text>
        ) : (
          <>
            <Box />
            <MileageBenefit productPrice={PRODUCT_PRICE} mileage={watch('mileage')} />
          </>
        )}
      </Flex>
      <Heading size="lg">결제 예정 금액</Heading>
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>상품금액</Text>
        <Box>
          <Text fontWeight="bold" fontSize="xl" as="span">
            {PRODUCT_PRICE.toLocaleString()}
          </Text>
          <Text as="span">원</Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>배송비 (선결제)</Text>
        <Box>
          <Text fontWeight="bold" fontSize="xl" as="span">
            {`+ ${SHIPPING_COST.toLocaleString()}`}
          </Text>
          <Text as="span">원</Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt={2} mb={2}>
        <Text>할인금액</Text>
        <Box>
          <Text fontWeight="bold" color="red" fontSize="xl" as="span">
            {`- ${DISCOUNT.toLocaleString()}`}
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
            {`- ${watch('mileage').toLocaleString()}`}
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
            {`- ${watch('couponAmount').toLocaleString()}`}
          </Text>
          <Text color="red" as="span">
            원
          </Text>
        </Box>
      </Flex>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontSize="xs">
                주문정보, 결제대행 이용약관 및 결제 진행 동의
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TermBox shopName={data[0].shopName} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex direction="column" justifyContent="space-evenly" alignItems="center" mt={3}>
        <Text variant="sup" fontSize="xs" mb={1}>
          상기 필수약관을 확인하였으며, 이에 동의합니다.
        </Text>
        <Button size="lg" colorScheme="blue" type="submit">
          {getOrderPrice(
            PRODUCT_PRICE,
            SHIPPING_COST,
            DISCOUNT,
            watch('couponAmount'),
            watch('mileage'),
          ).toLocaleString()}
          원 결제하기
        </Button>
      </Flex>
    </Box>
  );
}
