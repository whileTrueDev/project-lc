import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  MypageLayout,
  OrderDetailActions,
  OrderDetailDeliveryInfo,
  OrderDetailExportInfo,
  OrderDetailGoods,
  OrderDetailOptionList,
  OrderDetailRefundInfo,
  OrderDetailReturnInfo,
  OrderDetailSummary,
  OrderDetailTitle,
  OrderRefundExistsAlert,
  OrderReturnExistsAlert,
  SectionWithTitle,
} from '@project-lc/components';
import { useDisplaySize, useFmOrder } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react-transition-group/node_modules/@types/react';

const refundSectionTitle = '환불 정보';
const returnSectionTitle = '반품 정보';

/** 주문 상세 보기 페이지 */
export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = useFmOrder(orderId);

  const { isMobileSize } = useDisplaySize();

  if (order.isLoading) {
    return (
      <MypageLayout>
        <OrderDetailLoading />
      </MypageLayout>
    );
  }

  if (!order.isLoading && !order.data)
    return (
      <MypageLayout>
        <Box m="auto" maxW="4xl">
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
        </Box>
      </MypageLayout>
    );

  return (
    <MypageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2}>
        <Box as="section">
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => router.push('/mypage/orders')}
          >
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
          {order.data.items.map((item) => (
            <Box key={item.item_seq} mt={6}>
              <OrderDetailGoods orderItem={item} />
              <OrderDetailOptionList order={order.data} options={item.options} />
            </Box>
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

export function OrderDetailLoading() {
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
