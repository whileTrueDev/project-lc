import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { OrderDetailDeliveryInfo } from '@project-lc/components-seller/OrderDetailDeliveryInfo';
import { OrderDetailExportInfo } from '@project-lc/components-seller/OrderDetailExportInfo';
import { OrderDetailGoods } from '@project-lc/components-seller/OrderDetailGoods';
import { OrderDetailOptionList } from '@project-lc/components-seller/OrderDetailOptionList';
import { OrderDetailRefundInfo } from '@project-lc/components-seller/OrderDetailRefundInfo';
import { OrderDetailReturnInfo } from '@project-lc/components-seller/OrderDetailReturnInfo';
import { OrderRefundExistsAlert } from '@project-lc/components-seller/OrderRefundExistsAlert';
import { OrderReturnExistsAlert } from '@project-lc/components-seller/OrderReturnExistsAlert';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { useDisplaySize, useOrderDetail } from '@project-lc/hooks';
import {
  convertFmOrderShippingTypesToString,
  FmOrderShipping,
} from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { OrderDetailTitle } from '@project-lc/components-seller/kkshow-order/OrderDetailTitle';
import { OrderDetailActions } from '@project-lc/components-seller/kkshow-order/OrderDetailActions';
import { OrderDetailSummary } from '@project-lc/components-seller/kkshow-order/OrderDetailSummary';
import { OrderItemOptionInfo } from '@project-lc/components-shared/order/OrderItemOptionInfo';

const refundSectionTitle = '환불 정보';
const returnSectionTitle = '반품 정보';

/** 주문 상세 보기 페이지 */
export function OrderDetail(): JSX.Element {
  const router = useRouter();

  const orderCode = router.query.orderId as string; // 주문코드

  const order = useOrderDetail({ orderCode });

  const { isMobileSize } = useDisplaySize();

  // 현재 주문이 조회 가능한 주문인지 확인
  const isViewableOrder = useMemo(() => {
    if (!order.data) return null;
    return true;
  }, [order.data]);

  if (order.isLoading) {
    return (
      <MypageLayout>
        <OrderDetailLoading />
      </MypageLayout>
    );
  }

  if (!order.isLoading && !isViewableOrder)
    return (
      <MypageLayout>
        <Flex m="auto" maxW="4xl" h={400} justify="center" alignItems="center">
          <Stack spacing={2}>
            <Center>
              <Text>주문 데이터를 불러오지 못했습니다.</Text>
            </Center>
            <Center>
              <Text>주문이 없거나 올바르지 못한 주문번호입니다.</Text>
            </Center>
            <Center>
              <Button onClick={() => router.push('/mypage/orders')}>돌아가기</Button>
            </Center>
          </Stack>
        </Flex>
      </MypageLayout>
    );

  return (
    <MypageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2}>
        <Box as="section">
          <Button size="sm" leftIcon={<ChevronLeftIcon />} onClick={() => router.back()}>
            목록으로
          </Button>
        </Box>
        {/* 주문 제목 */}
        <Box as="section">
          <OrderDetailTitle order={order.data} />
        </Box>

        {/* 환불 , 반품 알림 문구 */}
        {(order.data.returns.length > 0 || order.data.refunds.length > 0) && (
          <Stack as="section">
            {order.data.returns.length > 0 && (
              <OrderReturnExistsAlert targetSectionTitle={returnSectionTitle} />
            )}
            {order.data.refunds.length > 0 && (
              <OrderRefundExistsAlert targetSectionTitle={refundSectionTitle} />
            )}
          </Stack>
        )}

        {/* 퍼스트몰 사용하지 않으면 판매자 -> 관리자로 결제취소 요청 필요없음  */}
        {/* {orderCancel.data &&
          orderCancel.data.status !== .confirmed && (
            <OrderCancelRequestExistAlert data={orderCancel.data} />
          )} */}

        {/* 주문 버튼 */}
        {isMobileSize ? null : (
          <Box as="section" mt={4}>
            <OrderDetailActions order={order.data} />
          </Box>
        )}

        {/* 주문 요약 */}
        <Box as="section">
          <OrderDetailSummary order={order.data} />
        </Box>

        {/* 주문 상품 정보 */}
        {/*  // TODO: 주문-배송비 테이블 생성 후 주석 처리된 코드처럼 OrderDetailShippingItem 활용하여 주문상품 표시하도록 수정하기(임의로 주문상품정보 표시하도록 해둠) */}
        {/* <SectionWithTitle title="주문 상품 정보">
          {order.data.shippings.map((shipping) => (
            <OrderDetailShippingItem key={shipping.shipping_seq} shipping={shipping} />
          ))}
        </SectionWithTitle> */}
        <SectionWithTitle title="주문 상품 정보">
          {order.data.orderItems.flatMap((item) =>
            item.options.map((opt) => (
              <OrderItemOptionInfo
                key={opt.id}
                order={order.data}
                option={opt}
                orderItem={item}
              />
            )),
          )}
        </SectionWithTitle>

        {/* 주문자 / 수령자 정보 */}
        <SectionWithTitle title="주문자 / 수령자 정보">
          {/* OrderDetailDeliveryInfo는 기존 컴포넌트 그대로 사용함 */}
          <OrderDetailDeliveryInfo
            orderDeliveryData={{
              order_phone: '', // 주문자전화
              recipient_phone: '',
              recipient_address_street: '',
              recipient_address: order.data.recipientAddress,
              recipient_address_detail: order.data.recipientDetailAddress,
              order_user_name: order.data.ordererName,
              order_email: order.data.ordererEmail,
              order_cellphone: order.data.ordererPhone, // '주문자휴대폰',
              recipient_user_name: order.data.recipientAddress,
              recipient_zipcode: order.data.recipientPostalCode,
              recipient_cellphone: order.data.recipientPhone,
              recipient_email: order.data.recipientEmail,
              memo: order.data.memo,
            }}
          />
        </SectionWithTitle>

        {/* 출고 정보 */}
        {/* // TODO: 출고정보 연결 */}
        {/* {order.data.exports.length > 0 && (
          <SectionWithTitle title="출고 정보">
            {order.data.exports.map((_exp) => (
              <Box key={_exp.export_code} mt={6} pb={4}>
                <OrderDetailExportInfo
                  key={_exp.export_code}
                  exports={_exp}
                  orderItems={order.data.items}
                />
              </Box>
            ))}
          </SectionWithTitle>
        )} */}

        {/* 반품 정보 */}
        {/* // TODO: 반품 정보 연결 */}
        {order.data.returns.length > 0 && (
          <SectionWithTitle title={returnSectionTitle}>
            {order.data.returns.map((_ret) => (
              <Box key={_ret.returnCode} mt={6} pb={4}>
                {/* <OrderDetailReturnInfo returns={_ret} /> */}
              </Box>
            ))}
          </SectionWithTitle>
        )}

        {/* 환불 정보 */}
        {/* // TODO: 환불 정보 연결 */}
        {/* {order.data.refunds.length > 0 && (
          <SectionWithTitle title={refundSectionTitle}>
            {order.data.refunds.map((_ref) => (
              <Box key={_ref.refund_code} mt={6} pb={4}>
                <OrderDetailRefundInfo refund={_ref} />
              </Box>
            ))}
          </SectionWithTitle>
        )} */}
      </Stack>
    </MypageLayout>
  );
}

export default OrderDetail;

export function OrderDetailLoading(): JSX.Element {
  return (
    <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2}>
      <Stack p={4}>
        <Skeleton height={12} />
        <Skeleton height={6} w={280} />
      </Stack>

      <Stack mt={6}>
        <Stack
          padding="6"
          boxShadow="lg"
          bg={useColorModeValue('gray.200', 'gray.700')}
          direction="row"
          spacing={6}
        >
          <Skeleton w={280} height={72} />
          <VStack>
            <Box w={280}>
              <SkeletonCircle size="12" />
              <SkeletonText mt="4" noOfLines={4} spacing="4" />
            </Box>
          </VStack>
        </Stack>
      </Stack>
    </Stack>
  );
}

interface OrderDetailShippingItemProps {
  shipping: FmOrderShipping;
}
function OrderDetailShippingItem({
  shipping,
}: OrderDetailShippingItemProps): JSX.Element {
  return (
    <Box key={shipping.shipping_seq} mt={6} borderWidth="0.025rem" p={2} pl={4}>
      {/* 배송정보 */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
        <Text>{convertFmOrderShippingTypesToString(shipping.shipping_type)}</Text>
        {shipping.shipping_type === 'free' ? null : (
          <>
            <TextDotConnector />
            <Text>배송비: {getLocaleNumber(shipping.shipping_cost)} 원</Text>
          </>
        )}
      </Stack>

      {/* 상품(옵션) 정보 */}
      <Box mt={4}>
        {shipping.items.map((item) => (
          <Box key={item.item_seq} mt={2}>
            <OrderDetailGoods orderItem={item} />
            <OrderDetailOptionList options={item.options} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
