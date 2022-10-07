import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { SuccessDeliveryAddress } from '@project-lc/components-web-kkshow/payment/DeliveryAddress';
import {
  MobileReceiptOrderItemInfo,
  ReceiptOrderItemInfo,
} from '@project-lc/components-web-kkshow/payment/ReceiptOrderItemInfo';
import { useDisplaySize, useOrderDetail, usePaymentByOrderCode } from '@project-lc/hooks';
import { pushDataLayer } from '@project-lc/utils-frontend';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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

  useEffect(() => {
    if (orderDetailData && paymentData) {
      const transactionId = paymentData.transactionKey; // 거래의 고유식별자. 토스 트랜잭션 키 보냄.(크크쇼 주문번호 아님);
      const orderPrice = Number(orderDetailData.orderPrice);
      const totalShippingCosts = orderDetailData.shippings
        .map((s) => Number(s.shippingCost))
        .reduce((sum, sc) => sum + sc);
      const items = orderDetailData.orderItems
        .flatMap((oi) => {
          const { goodsId } = oi;
          return oi.options.map((opt) => ({ ...opt, goodsId }));
        })
        .map((opt: OrderItemOption & { goodsId: number }) => ({
          item_id: opt.goodsId,
          item_name: opt.goodsName,
          price: Number(opt.discountPrice),
          quantity: opt.quantity,
          item_variant: opt.value,
        }));

      // 결제 성공 이후 receipt 페이지로 이동했을 때 purchase 이벤트 발생 & 데이터 보냄
      pushDataLayer({
        event: 'purchase',
        ecommerce: {
          transaction_id: transactionId,
          value: orderPrice,
          shipping: totalShippingCosts,
          currency: 'KRW',
          items,
        },
      });
    }
  }, [orderDetailData, paymentData]);

  if (orderDetailLoading) {
    return (
      <KkshowLayout navbarFirstLink="kkmarket">
        <Center minHeight="80vh">
          <Spinner />
        </Center>
      </KkshowLayout>
    );
  }
  return (
    <KkshowLayout navbarFirstLink="kkmarket">
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
                <Heading>주문 완료</Heading>
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              <Text fontSize="lg" fontWeight="bold">
                주문코드
              </Text>
              <Flex bg={virtualAccountBoxBgColor} p={5} rounded="md" alignItems="center">
                <Text>{orderCode}</Text>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="blue"
                  ml={2}
                  onClick={copyOrderCode}
                >
                  복사
                </Button>
              </Flex>
            </GridItem>
            <GridItem colSpan={7}>
              {paymentData.virtualAccount && (
                <Flex direction="column">
                  <Flex mb={5} direction="column">
                    <Text fontSize="lg" fontWeight="bold">
                      가상계좌 입금정보
                    </Text>
                    <Text fontSize="sm">
                      * 입금기한까지 입금되지 않으면, 주문이 취소됩니다.
                    </Text>
                  </Flex>
                  <Box bg={virtualAccountBoxBgColor} p={5} rounded="md">
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
              <Text fontSize="lg" fontWeight="bold">
                배송지 정보
              </Text>
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
              <Flex justifyContent="space-between" color="gray.500" fontSize="sm">
                <Text>상품금액</Text>
                <Text>{productOriginPrice.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500" fontSize="sm">
                <Text>할인</Text>
                <Text>- {discount.toLocaleString()}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500" fontSize="sm">
                <Text>배송비</Text>
                <Text>+ {totalShippingCost}</Text>
              </Flex>
              <Flex justifyContent="space-between" color="gray.500" fontSize="sm">
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

              {/* 카드결제의 경우 */}
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
              {/* 계좌이체의 경우 */}
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
            <GridItem
              colSpan={7}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <ButtonGroup>
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
              </ButtonGroup>
            </GridItem>
          </Grid>
        )}
      </Flex>
    </KkshowLayout>
  );
}

export default Receipt;
