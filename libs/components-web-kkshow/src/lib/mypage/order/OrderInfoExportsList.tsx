import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ExportItem } from '@prisma/client';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { DeliveryTrackingButton } from '@project-lc/components-shared/delivery-tracking/DeliveryTracking';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { ExportBaseData, OrderDetailRes } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { FaGift, FaTruck } from 'react-icons/fa';

interface OrderInfoExportsListProps {
  order: OrderDetailRes;
  exports: OrderDetailRes['exports'];
}
export function OrderInfoExportsList({
  order,
  exports,
}: OrderInfoExportsListProps): JSX.Element {
  if (!exports)
    return (
      <Box>
        <Text>아직 배송처리가 진행되지 않은 주문입니다.</Text>
      </Box>
    );
  if (exports.length === 0) {
    return (
      <Box>
        <Text>아직 배송처리가 진행되지 않은 주문입니다.</Text>
      </Box>
    );
  }
  if (order.giftFlag) {
    return <OrderInfoGiftExportsItem order={order} exports={exports} />;
  }
  return (
    <Box>
      <Box>
        <Text>
          ({order.recipientPostalCode}) {order.recipientAddress}{' '}
          {order.recipientDetailAddress}
        </Text>
        <Text>{order.recipientName}</Text>
        <Text>{order.recipientPhone}</Text>
        <Text>{order.recipientEmail}</Text>
        <Text>{order.memo}</Text>
      </Box>

      {exports.map((ex) => (
        <Box key={ex.id} borderWidth="thin" p={2} rounded="md" my={2}>
          {ex.items.map((expi) => (
            <OrderInfoExportsItem
              key={expi.id}
              order={order}
              exportData={ex}
              exportItem={expi}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
interface OrderInfoGiftExportsItemProps {
  order: OrderDetailRes;
  exports: ExportBaseData[];
}
function OrderInfoGiftExportsItem({
  exports,
}: OrderInfoGiftExportsItemProps): JSX.Element {
  const isNowShipping = useMemo(
    () =>
      exports.every((e) =>
        e.items.every((ei) => ['shipping', 'partialShipping'].includes(ei.status)),
      ),
    [exports],
  );
  const isShippingDone = useMemo(
    () =>
      exports.every((e) =>
        e.items.every((ei) =>
          ['shippingDone', 'partialShippingDone', 'purchaseConfirmed'].includes(
            ei.status,
          ),
        ),
      ),
    [exports],
  );
  const isDeliveryStarted = useMemo(
    () =>
      exports.every((e) =>
        e.items.every((ei) =>
          [
            'exportDone',
            'partialShipping',
            'shipping',
            'partialShippingDone',
            'shippingDone',
            'purchaseConfirmed',
          ].includes(ei.status),
        ),
      ),
    [exports],
  );

  return (
    <Alert variant="left-accent" status={isShippingDone ? 'success' : 'info'}>
      <AlertIcon as={isShippingDone ? FaGift : FaTruck} />
      <Stack>
        <AlertTitle noOfLines={1}>이 주문은 방송인에게 선물한 주문입니다.</AlertTitle>
        <AlertDescription>
          {!isDeliveryStarted ? (
            <Text>선물한 상품이 아직 배송시작하지 않았습니다.</Text>
          ) : (
            <>
              {isNowShipping && (
                <Text>선물한 상품이 방송인에게 안전하게 전달되고 있습니다.</Text>
              )}
              {isShippingDone && (
                <Text>선물한 상품이 방송인에게 올바르게 전달되었습니다.</Text>
              )}
            </>
          )}
        </AlertDescription>
      </Stack>
    </Alert>
  );
}

export default OrderInfoExportsList;

interface OrderInfoExportsItemProps {
  order: OrderDetailRes;
  exportItem: ExportItem;
  exportData: ExportBaseData;
}
export function OrderInfoExportsItem({
  exportItem,
  exportData,
  order,
}: OrderInfoExportsItemProps): JSX.Element | null {
  const orderItem = useMemo(
    () => order.orderItems.find((oi) => oi.id === exportItem.orderItemId),
    [exportItem.orderItemId, order.orderItems],
  );
  const orderItemOption = useMemo(
    () => orderItem?.options.find((oio) => oio.id === exportItem.orderItemOptionId),
    [exportItem.orderItemOptionId, orderItem?.options],
  );
  if (!orderItem || !orderItemOption) return null;
  return (
    <Box key={exportItem.id}>
      <Flex gap={2}>
        {orderItem.goods.image.length > 0 && (
          <Image
            src={orderItem.goods.image[0].image}
            width={50}
            height={50}
            objectFit="cover"
            draggable={false}
            rounded="md"
          />
        )}
        <Box fontSize="sm">
          <OrderStatusBadge step={exportItem.status} />
          <HStack>
            <Text>{orderItemOption.goodsName}</Text>
            <TextDotConnector />
            <Text>
              {orderItemOption.name}: {orderItemOption.value}
            </Text>
            <Text>{exportItem.amount}개</Text>
          </HStack>

          <HStack>
            <Text>{exportData.deliveryCompany}</Text>
            <TextDotConnector />
            <Text>{exportData.deliveryNumber}</Text>
          </HStack>
          <DeliveryTrackingButton
            deliveryCompany={exportData.deliveryCompany}
            deliveryNumber={exportData.deliveryNumber}
            enableWarning
          />
        </Box>
      </Flex>
    </Box>
  );
}
