import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Flex, Stack, Text } from '@chakra-ui/react';
import { OrderItemOption, OrderShipping } from '@prisma/client';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { OrderDetailActions } from '@project-lc/components-seller/kkshow-order/OrderDetailActions';
import { OrderDetailCancelInfo } from '@project-lc/components-seller/kkshow-order/OrderDetailCancelInfo';
import { OrderDetailExchangeInfo } from '@project-lc/components-seller/kkshow-order/OrderDetailExchangeInfo';
import { OrderDetailExportInfo } from '@project-lc/components-seller/kkshow-order/OrderDetailExportInfo';
import { OrderDetailReturnInfo } from '@project-lc/components-seller/kkshow-order/OrderDetailReturnInfo';
import { OrderDetailSummary } from '@project-lc/components-seller/kkshow-order/OrderDetailSummary';
import { OrderDetailTitle } from '@project-lc/components-seller/kkshow-order/OrderDetailTitle';
import { OrderExchangeReturnCancelExistsAlert } from '@project-lc/components-seller/kkshow-order/OrderExchangeReturnCancelExistsAlert';
import { OrderDetailDeliveryInfo } from '@project-lc/components-seller/OrderDetailDeliveryInfo';
import { OrderDetailOptionList } from '@project-lc/components-seller/OrderDetailOptionList';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { OrderDetailLoading } from '@project-lc/components-shared/order/OrderDetailLoading';
import { useDisplaySize, useOrderDetail, useProfile } from '@project-lc/hooks';
import { ExportBaseData } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const exchangeSectionTitle = '교환(재배송) 정보';
const returnSectionTitle = '반품(환불) 정보';
const orderCancelSectionTitle = '주문취소 정보';

/** 주문 상세 보기 페이지 */
export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const { data: profileData } = useProfile();
  const orderCode = router.query.orderCode as string; // 주문코드
  const order = useOrderDetail({ orderCode, sellerId: profileData?.id });
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
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2} mb={40}>
        <Box as="section">
          <Button size="sm" leftIcon={<ChevronLeftIcon />} onClick={() => router.back()}>
            목록으로
          </Button>
        </Box>
        {/* 주문 제목 */}
        <Box as="section">
          <OrderDetailTitle order={order.data} />
        </Box>

        {/* 반품(환불), 교환(재배송) 요청 여부 알림 문구 */}
        {(order.data.returns.length > 0 ||
          order.data.exchanges.length > 0 ||
          order.data.orderCancellations.length > 0) && (
          <Stack as="section">
            {order.data.returns.length > 0 && (
              <OrderExchangeReturnCancelExistsAlert
                alertTypeKey="return"
                targetSectionTitle={returnSectionTitle}
              />
            )}
            {order.data.exchanges.length > 0 && (
              <OrderExchangeReturnCancelExistsAlert
                alertTypeKey="exchange"
                targetSectionTitle={exchangeSectionTitle}
              />
            )}
            {order.data.orderCancellations.length > 0 && (
              <OrderExchangeReturnCancelExistsAlert
                alertTypeKey="cancel"
                targetSectionTitle={orderCancelSectionTitle}
              />
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
          {order.data.shippings.map((_shipping) => {
            const { items, ...orderShipping } = _shipping;
            const options = items.flatMap((i) => i.options);
            const shipping = { ...orderShipping, options };
            return (
              <OrderDetailShippingItem
                key={shipping.id}
                shipping={shipping}
                exports={order.data.exports}
              />
            );
          })}
        </SectionWithTitle>

        {/* 주문자 / 수령자 정보 */}
        <SectionWithTitle title="주문자 / 수령자 정보">
          <OrderDetailDeliveryInfo orderDeliveryData={order.data} />
        </SectionWithTitle>

        {/* 출고 정보 */}
        {order.data.exports.length > 0 && (
          <SectionWithTitle title="출고 정보">
            {order.data.exports.map((_exp) => (
              <Box key={_exp.exportCode} mt={6} pb={4}>
                <OrderDetailExportInfo key={_exp.exportCode} exportData={_exp} />
              </Box>
            ))}
          </SectionWithTitle>
        )}

        {/* 반품(환불) 정보 */}
        {order.data.returns.length > 0 && (
          <SectionWithTitle title={returnSectionTitle}>
            {order.data.returns.map((_ret) => (
              <Box key={_ret.returnCode} mt={6} pb={4}>
                <OrderDetailReturnInfo returnData={_ret} />
              </Box>
            ))}
          </SectionWithTitle>
        )}
        {/* 교환(재배송) 정보 */}
        {order.data.exchanges.length > 0 && (
          <SectionWithTitle title={exchangeSectionTitle}>
            {order.data.exchanges.map((exchangeData) => (
              <Box key={exchangeData.exchangeCode} mt={6} pb={4}>
                <OrderDetailExchangeInfo exchangeData={exchangeData} order={order.data} />
              </Box>
            ))}
          </SectionWithTitle>
        )}

        {/* 환불 정보 -> 크크쇼에는 환불요청 = 반품임. 환불정보 대신 주문취소요청을 표시함
         */}
        {order.data.orderCancellations.length > 0 && (
          <SectionWithTitle title={orderCancelSectionTitle}>
            {order.data.orderCancellations.map((cancelData) => (
              <Box key={cancelData.cancelCode} mt={6} pb={4}>
                <OrderDetailCancelInfo cancelData={cancelData} />
              </Box>
            ))}
          </SectionWithTitle>
        )}
      </Stack>
    </MypageLayout>
  );
}

export default OrderDetail;

interface OrderDetailShippingItemProps {
  shipping: OrderShipping & { options: OrderItemOption[] };
  exports: ExportBaseData[];
}
function OrderDetailShippingItem({
  shipping,
  exports,
}: OrderDetailShippingItemProps): JSX.Element {
  return (
    <Box key={shipping.id} mt={6} borderWidth="0.025rem" p={2} pl={4}>
      {/* 배송정보 */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
        {shipping.shippingCostPayType !== 'free' && (
          <Text>배송비: {getLocaleNumber(shipping.shippingCost)} 원</Text>
        )}
      </Stack>

      {/* 상품(옵션) 정보 */}
      <Box mt={4}>
        <OrderDetailOptionList options={shipping.options} exports={exports} />
      </Box>
    </Box>
  );
}
