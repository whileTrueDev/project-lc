import { Box, Button, Heading, Text, Flex, Center } from '@chakra-ui/react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { useTerms } from '@project-lc/hooks';
import { useKkshowOrderStore } from '@project-lc/stores';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

export function PaymentBox(): JSX.Element {
  const CLIENT_KEY = process.env.NEXT_PUBLIC_PAYMENTS_CLIENT_KEY!;
  /** 상품상세페이지와 연결 이후, goods로부터 정보 가져오도록 변경 */
  const PRODUCT_PRICE = 19000;
  const SHIPPING_COST = 3000;
  const DISCOUNT = 3000;

  function getOrderPrice(
    originalPrice: number,
    shippingCost: number,
    discount: number,
    mileageDiscount: number,
    couponDiscount: number,
  ): number {
    return originalPrice + shippingCost - discount - mileageDiscount - couponDiscount;
  }

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext<any>();

  const { coupon, mileage } = useKkshowOrderStore();

  function doPayment(): void {
    loadTossPayments(CLIENT_KEY).then((tossPayments) => {
      tossPayments.requestPayment('카드', {
        amount: getOrderPrice(PRODUCT_PRICE, SHIPPING_COST, DISCOUNT, mileage, coupon),
        orderId: `${(dayjs().format('YYYYMMDDHHmmssSSS'), nanoid(6))}`,
        orderName: '토스 티셔츠',
        customerName: '고객명',
        successUrl: `http://localhost:4000/payment/success`,
        failUrl: `http://localhost:4000/payment/fail`,
      });
    });
  }

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
      >
        <Heading size="lg">결제 예정 금액</Heading>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>상품금액</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              {PRODUCT_PRICE}
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>배송비 (선결제)</Text>
          <Box>
            <Text fontWeight="bold" fontSize="xl" as="span">
              {`+ ${SHIPPING_COST}`}
            </Text>
            <Text as="span">원</Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" mt={2} mb={2}>
          <Text>할인금액</Text>
          <Box>
            <Text fontWeight="bold" color="red" fontSize="xl" as="span">
              {`- ${DISCOUNT}`}
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
              {`- ${mileage || 0}`}
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
              {`- ${watch('coupon') || 0}`}
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
          <Button onClick={() => doPayment()} size="lg" colorScheme="blue">
            {getOrderPrice(
              PRODUCT_PRICE,
              SHIPPING_COST,
              DISCOUNT,
              watch('coupon') || 0,
              watch('mileage') || 0,
            ).toLocaleString()}
            원 결제하기
          </Button>
        </Center>
      </Box>
      <Text>개인정보 판매자 제공 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>개인정보 수집 및 이용 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
      <Text>주문상품정보 동의</Text>
      <Box overflow="scroll" h="200px" mb={3} border="solid">
        <HtmlStringBox
          htmlString={useTerms({ userType: 'broadcaster' }).broadcasterTerms[0].text}
        />
      </Box>
    </Box>
  );
}

export default PaymentBox;
