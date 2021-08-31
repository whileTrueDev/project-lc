import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import {
  FmOrderStatusBadge,
  FmRefundStatusBadge,
  FmReturnStatusBadge,
  MypageLayout,
  OrderDetailDeliveryInfo,
  OrderDetailExportInfo,
  OrderDetailGoods,
  OrderDetailOptionList,
  OrderDetailRefundInfo,
  OrderDetailReturnInfo,
  OrderDetailSummary,
  OrderRefundExistsAlert,
  OrderReturnExistsAlert,
  SectionWithTitle,
  TextDotConnector,
} from '@project-lc/components';
import { useFmOrder } from '@project-lc/hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import React from 'react-transition-group/node_modules/@types/react';

dayjs.locale('ko');
dayjs.extend(relativeTime);

const refundSectionTitle = '환불 정보';
const returnSectionTitle = '반품 정보';

/** 주문 상세 보기 페이지 */
export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const order = useFmOrder(orderId);

  if (order.isLoading)
    return (
      <MypageLayout>
        <Center>
          <Spinner />
        </Center>
      </MypageLayout>
    );

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
          <Button size="sm" leftIcon={<ChevronLeftIcon />} onClick={() => router.back()}>
            목록으로
          </Button>
        </Box>

        <Box as="section">
          <Heading>주문 {order.data.id}</Heading>
          <Stack direction="row" alignItems="center">
            <FmOrderStatusBadge orderStatus={order.data.step} />
            {order.data.refunds && (
              <FmRefundStatusBadge refundStatus={order.data.refunds.status} />
            )}
            {order.data.returns && (
              <FmReturnStatusBadge returnStatus={order.data.returns.status} />
            )}
            <TextDotConnector />
            <Text>{dayjs(order.data.regist_date).fromNow()}</Text>
          </Stack>
        </Box>

        <Stack as="section">
          {order.data.returns && (
            <OrderReturnExistsAlert targetSectionTitle={returnSectionTitle} />
          )}
          {order.data.refunds && (
            <OrderRefundExistsAlert targetSectionTitle={refundSectionTitle} />
          )}
        </Stack>

        <Box as="section" mt={4}>
          <OrderDetailSummary order={order.data} />
        </Box>

        <SectionWithTitle title="주문 상품 정보">
          <OrderDetailGoods order={order.data} />
          <OrderDetailOptionList order={order.data} options={order.data.options} />
        </SectionWithTitle>

        <SectionWithTitle title="주문자 / 수령자 정보">
          <OrderDetailDeliveryInfo order={order.data} />
        </SectionWithTitle>

        {order.data.exports && (
          <SectionWithTitle title="출고 정보">
            <OrderDetailExportInfo
              options={order.data.options}
              exports={order.data.exports}
            />
          </SectionWithTitle>
        )}

        {order.data.returns && (
          <SectionWithTitle title={returnSectionTitle}>
            <OrderDetailReturnInfo returns={order.data.returns} />
          </SectionWithTitle>
        )}

        {order.data.refunds && (
          <SectionWithTitle title={refundSectionTitle}>
            <OrderDetailRefundInfo
              options={order.data.options}
              refund={order.data.refunds}
            />
          </SectionWithTitle>
        )}
      </Stack>
    </MypageLayout>
  );
}

export default OrderDetail;
