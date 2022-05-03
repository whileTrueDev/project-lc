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
} from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { useTerms } from '@project-lc/hooks';
// import { useKkshowOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';

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

function getOrderPrice(
  originalPrice: number,
  shippingCost: number,
  discount: number,
  mileageDiscount: number,
  couponDiscount: number,
): number {
  return originalPrice + shippingCost - discount - mileageDiscount - couponDiscount;
}

export function PaymentBox({ data }: { data: DummyOrder[] }): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  /** 상품상세페이지와 연결 이후, goods로부터 정보 가져오도록 변경 */
  const PRODUCT_PRICE = data
    .map((item) => item.consumer_price)
    .reduce((prev: number, curr: number) => prev + curr, 0);
  const SHIPPING_COST = data
    .map((item) => item.shipping_cost)
    .reduce((prev: number, curr: number) => prev + curr, 0);
  const DISCOUNT = 3000;

  const { handleSubmit, watch, getValues } = useFormContext<PaymentPageDto>();

  const onSubmit: SubmitHandler<PaymentPageDto> = () => {
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
    loadTossPayments(CLIENT_KEY).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        amount: getOrderPrice(
          PRODUCT_PRICE,
          SHIPPING_COST,
          DISCOUNT,
          getValues('mileage'),
          getValues('couponAmount'),
        ),
        orderId: `${(dayjs().format('YYYYMMDDHHmmssSSS'), nanoid(6))}`,
        orderName: '토스 티셔츠',
        customerName: getValues('name'),
        successUrl: `http://localhost:4000/payment/success`,
        failUrl: `http://localhost:4000/payment/fail`,
      });
    });
  };

  return (
    <Box p={4}>
      <Box
        position="sticky"
        top="0px"
        left="0px"
        right="0px"
        pt={5}
        backgroundColor="white"
        h="sm"
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
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
      </Box>
      <Text>개인정보 판매자 제공 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>개인정보 수집 및 이용 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>주문상품정보 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="1px solid" borderColor="gray.300">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
    </Box>
  );
}

export function MobilePaymentBox(): JSX.Element {
  const { watch, getValues, handleSubmit } = useFormContext<PaymentPageDto>();
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  /** 상품상세페이지와 연결 이후, goods로부터 정보 가져오도록 변경 */
  const PRODUCT_PRICE = 19000;
  const SHIPPING_COST = 3000;
  const DISCOUNT = 3000;

  const onSubmit: SubmitHandler<PaymentPageDto> = () => {
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
    loadTossPayments(CLIENT_KEY).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        amount: getOrderPrice(
          PRODUCT_PRICE,
          SHIPPING_COST,
          DISCOUNT,
          getValues('mileage'),
          getValues('couponAmount'),
        ),
        orderId: `${(dayjs().format('YYYYMMDDHHmmssSSS'), nanoid(6))}`,
        orderName: '토스 티셔츠',
        customerName: getValues('name'),
        successUrl: `http://localhost:4000/payment/success`,
        failUrl: `http://localhost:4000/payment/fail`,
      });
    });
  };
  return (
    <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
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
            <Text>개인정보 판매자 제공 동의</Text>
            <Box overflow="scroll" h="200px" mb={3} border="solid">
              <HtmlStringBox
                htmlString={
                  useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text
                }
              />
            </Box>
            <Text>개인정보 수집 및 이용 동의</Text>
            <Box overflow="scroll" h="200px" mb={3} border="solid">
              <HtmlStringBox
                htmlString={
                  useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text
                }
              />
            </Box>
            <Text>주문상품정보 동의</Text>
            <Box overflow="scroll" h="200px" mb={3} border="solid">
              <HtmlStringBox
                htmlString={
                  useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text
                }
              />
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Flex justifyContent="space-evenly" alignItems="center" mt={3}>
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

export default PaymentBox;
