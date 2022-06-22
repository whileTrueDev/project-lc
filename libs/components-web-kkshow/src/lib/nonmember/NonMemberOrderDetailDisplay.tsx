import {
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { usePaymentByOrderCode } from '@project-lc/hooks';
import {
  NonMemberOrderDetailRes,
  OrderDetailRes,
  Payment,
} from '@project-lc/shared-types';
import { CardDetail } from '@project-lc/components-shared/payment/CardDetail';
import { TransferDetail } from '@project-lc/components-shared/payment/TransferDetail';
import { VirtualAccountDetail } from '@project-lc/components-shared/payment/VirtualAccountDetail';
import dayjs from 'dayjs';
import { OrderItemOptionInfo } from '../mypage/orderList/OrderItemOptionInfo';
import { SuccessDeliveryAddress } from '../payment/DeliveryAddress';

export interface NonMemberOrderDetailDisplayProps {
  orderData: NonMemberOrderDetailRes;
}
export function NonMemberOrderDetailDisplay({
  orderData,
}: NonMemberOrderDetailDisplayProps): JSX.Element {
  const { data: paymentData } = usePaymentByOrderCode(
    orderData.order.payment?.paymentKey || '',
  );

  return (
    <Container>
      <Stack py={4} spacing={6}>
        <Heading>비회원 주문 조회</Heading>
        {/* 주문정보 */}
        <Stack direction="row">
          <Text fontSize="lg">주문번호 :</Text>
          <Text fontWeight="bold" fontSize="lg">
            {orderData.order.orderCode}
          </Text>
        </Stack>

        <Divider />

        {/* 주문상품정보, 배송비 */}
        <Stack>
          <Text fontWeight="bold" fontSize="lg">
            주문상품정보
          </Text>
          <NonmemberOrderItemsList order={orderData.order} />
        </Stack>
        <Divider />

        {/* 결제정보 */}
        <Text fontWeight="bold" fontSize="lg">
          결제정보
        </Text>
        <NonmemberPaymentInfo paymentData={paymentData} />
        <Divider />

        {/* 출고정보 */}
        <Text fontWeight="bold" fontSize="lg">
          출고정보
        </Text>
        <NonmemberExportInfo order={orderData.order} />

        {/* 받는사람 연락처 */}
        <Stack>
          <Text fontWeight="bold" fontSize="lg">
            연락처 정보
          </Text>
          <SuccessDeliveryAddress data={orderData.order} />
        </Stack>
        <Divider />
      </Stack>
    </Container>
  );
}

export default NonMemberOrderDetailDisplay;

export function NonmemberOrderItemsList({
  order,
}: {
  order: OrderDetailRes;
}): JSX.Element {
  return (
    <>
      {order.shippings?.map((shipping) => {
        const orderItemIdList = shipping.items.map((item) => item.id);
        const items = order.orderItems.filter((oi) => orderItemIdList.includes(oi.id));
        return (
          <Grid
            templateColumns="repeat(4,1fr)"
            borderWidth="1px"
            rounded="md"
            key={shipping.id}
            p={1}
          >
            <GridItem colSpan={3}>
              <Stack>
                {items.map((i) => {
                  return i.options.map((o) => {
                    return (
                      <OrderItemOptionInfo
                        key={o.id}
                        option={o}
                        orderItem={i}
                        order={order}
                      />
                    );
                  });
                })}
              </Stack>
            </GridItem>
            <GridItem
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Text>{items[0].goods.seller.sellerShop.shopName}</Text>
              <Text>{Number(shipping.shippingCost).toLocaleString()}원</Text>
            </GridItem>
          </Grid>
        );
      })}
    </>
  );
}

export function NonmemberPaymentInfo({
  paymentData,
}: {
  paymentData?: Payment;
}): JSX.Element {
  return (
    <Grid templateColumns="repeat(2, 1fr)" borderWidth="1px" rounded="md" p={1}>
      <GridItem>
        <Text>결제수단</Text>
      </GridItem>
      <GridItem>
        <Text>{paymentData?.method}</Text>
      </GridItem>
      {paymentData?.method === '카드' && <CardDetail paymentData={paymentData} />}
      {paymentData?.method === '가상계좌' && (
        <VirtualAccountDetail paymentData={paymentData} />
      )}
      {paymentData?.method === '계좌이체' && <TransferDetail paymentData={paymentData} />}
    </Grid>
  );
}

export function NonmemberExportInfo({ order }: { order: OrderDetailRes }): JSX.Element {
  if (!order.exports || order.exports.length === 0) {
    return <Text>아직 상품이 출고되지 않았습니다</Text>;
  }

  return (
    <>
      {order.exports.map((_export) => {
        const exportedItemsIdList = _export.items.map((item) => item.orderItemId);
        const exportedItems = order.orderItems.filter((item) =>
          exportedItemsIdList.includes(item.id),
        );

        return (
          <Grid key={_export.id} templateColumns="repeat(2, 1fr)" borderWidth="1px" p={1}>
            <GridItem>
              <Text>출고코드</Text>
            </GridItem>
            <GridItem>
              <Text>{_export.exportCode}</Text>
            </GridItem>
            <GridItem>
              <Text>택배사</Text>
            </GridItem>
            <GridItem>
              <Text>{_export.deliveryCompany}</Text>
            </GridItem>
            <GridItem>
              <Text>운송장번호</Text>
            </GridItem>
            <GridItem>
              <Text>{_export.deliveryNumber}</Text>
            </GridItem>
            <GridItem>
              <Text>출고일</Text>
            </GridItem>
            <GridItem>
              <Text>{dayjs(_export.exportDate).format('YYYY-MM-DD')}</Text>
            </GridItem>
            <GridItem>
              <Text>출고상품</Text>
            </GridItem>
            <GridItem>
              {exportedItems.map((item) => {
                return item.options.map((opt) => (
                  <Text key={opt.id}>
                    {item.goods.goods_name} {opt.name}:{opt.value} {opt.quantity}개
                  </Text>
                ));
              })}
            </GridItem>
          </Grid>
        );
      })}
    </>
  );
}
