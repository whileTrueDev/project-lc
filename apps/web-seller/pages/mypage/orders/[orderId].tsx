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
import { SellerOrderCancelRequestStatus } from '@prisma/client';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { OrderCancelRequestExistAlert } from '@project-lc/components-seller/OrderCancelRequestExistAlert';
import { OrderDetailActions } from '@project-lc/components-seller/OrderDetailActions';
import { OrderDetailDeliveryInfo } from '@project-lc/components-seller/OrderDetailDeliveryInfo';
import { OrderDetailExportInfo } from '@project-lc/components-seller/OrderDetailExportInfo';
import { OrderDetailGoods } from '@project-lc/components-seller/OrderDetailGoods';
import { OrderDetailOptionList } from '@project-lc/components-seller/OrderDetailOptionList';
import { OrderDetailRefundInfo } from '@project-lc/components-seller/OrderDetailRefundInfo';
import { OrderDetailReturnInfo } from '@project-lc/components-seller/OrderDetailReturnInfo';
import { OrderDetailSummary } from '@project-lc/components-seller/OrderDetailSummary';
import { OrderDetailTitle } from '@project-lc/components-seller/OrderDetailTitle';
import { OrderRefundExistsAlert } from '@project-lc/components-seller/OrderRefundExistsAlert';
import { OrderReturnExistsAlert } from '@project-lc/components-seller/OrderReturnExistsAlert';
import {
  useDisplaySize,
  useFmOrder,
  useSellerOrderCancelRequest,
} from '@project-lc/hooks';
import {
  convertFmOrderShippingTypesToString,
  FmOrderShipping,
  GoodsIdAndSellType,
} from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

const refundSectionTitle = '환불 정보';
const returnSectionTitle = '반품 정보';

/** 주문 상세 보기 페이지 */
export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = useFmOrder(orderId);
  const orderCancel = useSellerOrderCancelRequest(orderId);

  const { isMobileSize } = useDisplaySize();

  // 현재 주문이 조회 가능한 주문인지 확인
  const isViewableOrder = useMemo(() => {
    if (!order.data) return null;
    // 주문이 선물용이 아닌 경우 조회 가능한 주문임.
    return !order.data.giftFlag;
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

        {/* 결제취소요청 했을 경우 알림창 */}
        {orderCancel.data &&
          orderCancel.data.status !== SellerOrderCancelRequestStatus.confirmed && (
            <OrderCancelRequestExistAlert data={orderCancel.data} />
          )}

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
        <SectionWithTitle title="주문 상품 정보">
          {order.data.shippings.map((shipping) => (
            <OrderDetailShippingItem
              key={shipping.shipping_seq}
              shipping={shipping}
              sellType={order.data.sellTypes}
            />
          ))}
        </SectionWithTitle>

        {/* 주문자 / 수령자 정보 */}
        <SectionWithTitle title="주문자 / 수령자 정보">
          <OrderDetailDeliveryInfo orderDeliveryData={order.data} />
        </SectionWithTitle>

        {/* 출고 정보 */}
        {order.data.exports.length > 0 && (
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
        )}

        {/* 반품 정보 */}
        {order.data.returns.length > 0 && (
          <SectionWithTitle title={returnSectionTitle}>
            {order.data.returns.map((_ret) => (
              <Box key={_ret.return_code} mt={6} pb={4}>
                <OrderDetailReturnInfo returns={_ret} />
              </Box>
            ))}
          </SectionWithTitle>
        )}

        {/* 환불 정보 */}
        {order.data.refunds.length > 0 && (
          <SectionWithTitle title={refundSectionTitle}>
            {order.data.refunds.map((_ref) => (
              <Box key={_ref.refund_code} mt={6} pb={4}>
                <OrderDetailRefundInfo refund={_ref} />
              </Box>
            ))}
          </SectionWithTitle>
        )}
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
  sellType: GoodsIdAndSellType[];
}
function OrderDetailShippingItem({
  shipping,
  sellType,
}: OrderDetailShippingItemProps): JSX.Element {
  return (
    <Box key={shipping.shipping_seq} mt={6} borderWidth="0.025rem" p={2} pl={4}>
      {/* 배송정보 */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
        <Text>{convertFmOrderShippingTypesToString(shipping.shipping_type)}</Text>
        {shipping.shipping_type === 'free' ? null : (
          <>
            <TextDotConnector />
            <Text>배송비: {Number(shipping.shipping_cost).toLocaleString()} 원</Text>
          </>
        )}
      </Stack>

      {/* 상품(옵션) 정보 */}
      <Box mt={4}>
        {shipping.items.map((item) => (
          <Box key={item.item_seq} mt={2}>
            <OrderDetailGoods
              orderItem={item}
              sellType={sellType
                .filter((d) => d.goodsId === item.goods_seq)
                .map((d) => d.sellType)
                .pop()}
            />
            <OrderDetailOptionList options={item.options} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
