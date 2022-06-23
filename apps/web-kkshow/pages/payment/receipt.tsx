import {
  Box,
  Heading,
  Flex,
  Grid,
  GridItem,
  Text,
  Divider,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { useDisplaySize, usePaymentByOrderCode, useOrderDetail } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { SuccessDeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import {
  ReceiptOrderItemInfo,
  MobileReceiptOrderItemInfo,
} from '@project-lc/components-web-kkshow/payment/ReceiptOrderItemInfo';
import dayjs from 'dayjs';

export function Receipt(): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const { isDesktopSize } = useDisplaySize();
  const orderCode = router.query.orderCode as string;
  const orderId = Number(router.query.orderId);
  const { data: orderDetailData, isLoading: orderDetailLoading } = useOrderDetail({
    orderId,
  });
  const { data: paymentData, isLoading } = usePaymentByOrderCode(orderCode);
  const virtualAccountBoxBgColor = useColorModeValue('gray.100', 'gray.700');
  const productOriginPrice =
    orderDetailData?.orderItems
      .flatMap((item) => item.options)
      .map((opt) => Number(opt.normalPrice) * opt.quantity)
      .reduce((s, a) => s + Number(a), 0) || 0;

  const productDiscountedPrice =
    orderDetailData?.orderItems
      .flatMap((item) => item.options)
      .map((opt) => Number(opt.discountPrice) * opt.quantity)
      .reduce((s, a) => s + Number(a), 0) || 0;

  const discount = productOriginPrice - productDiscountedPrice;

  const totalShippingCost = orderDetailData?.shippings
    ? orderDetailData.shippings
        .map((s) => Number(s.shippingCost))
        .reduce((sum, cur) => sum + cur, 0)
        .toLocaleString()
    : '';

  const copyOrderCode = (): void => {
    navigator.clipboard.writeText(orderCode);

    toast({ title: '복사되었습니다.', status: 'success' });
  };

  if (orderDetailLoading) {
    return (
      <KkshowLayout>
        <Center minHeight="80vh">
          <Spinner />
        </Center>
      </KkshowLayout>
    );
  }
  return (
    <KkshowLayout>
      <Flex m="auto" alignItems="center" justifyContent="center" direction="column" p={2}>
        {!isLoading && paymentData && (
          <Grid
            templateColumns="repeat(7, 5fr)"
            gap={6}
            w={{ base: '100%', md: '45%' }}
            m={10}
          >
            <GridItem colSpan={7}>
              <Flex direction="column" alignItems="center" justifyContent="center" p={2}>
                {isDesktopSize ? (
                  <Heading m={10}>주문이 정상적으로 완료되었습니다</Heading>
                ) : (
                  <Heading>주문 완료</Heading>
                )}
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              <Heading>주문코드</Heading>
              {orderDetailData?.nonMemberOrderFlag && (
                <Text fontSize="sm">
                  * 비회원 주문조회시 주문코드와 주문자명이 필요합니다.
                </Text>
              )}
              <Flex
                bg={virtualAccountBoxBgColor}
                p={5}
                borderRadius="10px"
                alignItems="center"
              >
                <Text fontSize={{ base: 'md', sm: 'xl' }}>{orderCode}</Text>
                <Button size="sm" ml={4} onClick={copyOrderCode}>
                  복사
                </Button>
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              {paymentData.virtualAccount && (
                <Flex direction="column">
                  <Flex mb={5} direction="column">
                    <Heading size="lg">가상계좌 입금정보</Heading>
                    <Text fontSize="sm">
                      * 입금기한까지 입금되지 않으면, 주문이 취소됩니다.
                    </Text>
                  </Flex>
                  <Box bg={virtualAccountBoxBgColor} p={5} borderRadius="10px">
                    <Flex justifyContent="space-between">
                      <Text>입금액</Text>
                      <Text fontWeight="bold">
                        {paymentData.totalAmount.toLocaleString()}원
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금 계좌번호</Text>
                      <Text fontWeight="bold">
                        {paymentData.virtualAccount.accountNumber}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금은행</Text>
                      <Text fontWeight="bold">{paymentData.virtualAccount.bank}</Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Text>입금기한</Text>
                      <Text fontWeight="bold">
                        {dayjs(paymentData.virtualAccount.dueDate).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )}
            </GridItem>
            <GridItem colSpan={4}>
              <Heading size="lg">배송지 정보</Heading>
              <SuccessDeliveryAddress data={orderDetailData} />
            </GridItem>
            <GridItem
              colSpan={3}
              borderLeft="solid 1px"
              borderLeftColor="gray.300"
              pl={2}
            >
              <Flex
                justifyContent="space-between"
                alignItems="flex-end"
                mb={5}
                direction="column"
              >
                <Text fontSize="xl">결제금액</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {paymentData.totalAmount.toLocaleString()}
                </Text>
              </Flex>
              <Divider />
              <Flex justifyContent="space-between" color="gray.500">
                <Text>상품금액</Text>
                <Text>{productOriginPrice.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>할인</Text>
                <Text>- {discount.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>배송비</Text>
                <Text>+ {totalShippingCost}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>쿠폰사용</Text>
                <Text>
                  -{' '}
                  {orderDetailData?.customerCouponLogs[0]?.customerCoupon.coupon.amount.toLocaleString() ||
                    0}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500">
                <Text>적립금사용</Text>
                <Text>
                  - {orderDetailData?.mileageLogs[0]?.amount.toLocaleString() || 0}
                </Text>
              </Flex>
              <Divider mt={2} mb={2} />
              {paymentData.card && (
                <Flex justifyContent="space-between">
                  <Box fontSize="xs">
                    <Text>{paymentData.card.company}</Text>
                    <Text>{paymentData.card.number}</Text>
                    <Divider m={1} />
                    <Text>승인일시</Text>
                    <Text>
                      {dayjs(paymentData.approvedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </Box>
                  {paymentData.card.installmentPlanMonths === 0 ? (
                    <Text>일시불</Text>
                  ) : (
                    <Text>{paymentData.card.installmentPlanMonths}개월 할부</Text>
                  )}
                </Flex>
              )}
              {paymentData.transfer && (
                <>
                  <Flex justifyContent="space-between">
                    <Text>결제수단</Text>
                    <Text>계좌이체</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text>은행</Text>
                    <Text>{paymentData.transfer.bank}</Text>
                  </Flex>
                </>
              )}
            </GridItem>
            <GridItem colSpan={7}>
              {isDesktopSize ? (
                <ReceiptOrderItemInfo data={orderDetailData?.orderItems} />
              ) : (
                <MobileReceiptOrderItemInfo data={orderDetailData?.orderItems} />
              )}
            </GridItem>
            <GridItem colSpan={7}>
              <Flex alignContent="center" justifyContent="center" mt="10%" mb="10%">
                <Flex justifyContent="space-around" w={{ base: '80%', md: '40%' }}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (orderDetailData.nonMemberOrderFlag) {
                        // 비회원주문인경우 비회원주문조회 페이지로 이동
                        router.push('/nonmember');
                      } else {
                        // 아닌경우 마이페이지-주문상세 로 이동
                        router.push(`/mypage/orders/${orderCode}`);
                      }
                    }}
                  >
                    주문 상세보기
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => {
                      router.push('/shopping');
                    }}
                  >
                    쇼핑 계속하기
                  </Button>
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
        )}
      </Flex>
    </KkshowLayout>
  );
}

export default Receipt;
