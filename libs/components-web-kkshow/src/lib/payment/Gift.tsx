import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { getOrderShippingCheck } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import OrderItemSupport from './OrderItemSupport';

export function GiftBox(): JSX.Element {
  const { control, watch, getValues } = useFormContext<CreateOrderForm>();
  const { fields } = useFieldArray({ control, name: 'orderItems' });
  const { setShippingData } = useKkshowOrderStore();

  // * 선물 대상 방송인 고유번호 찾기
  const orderItems = watch('orderItems');
  const supportData = orderItems
    .filter((item) => !!item.support)
    .map((item) => item.support);
  const broadcasterId = supportData[0]?.broadcasterId;

  // * 배송비 계산 요청
  useEffect(() => {
    if (broadcasterId) {
      const params = {
        broadcasterId, // 선물 대상 방송인 고유번호
        isGiftOrder: true, // 선물주문임
        items: getValues('orderItems')
          .flatMap((i) => {
            return i.options.map((opt) => ({ ...opt, goodsId: i.goodsId }));
          })
          .map((opt) => ({
            goodsId: opt.goodsId,
            goodsOptionId: opt.goodsOptionId,
            quantity: opt.quantity,
          })),
      };

      if (params.items.length > 0) {
        getOrderShippingCheck(params)
          .then((res) => {
            if (res) {
              setShippingData(res);
            }
          })
          .catch((e) => console.error(e));
      }
    }
  }, [broadcasterId, getValues, setShippingData]);

  return (
    <SectionWithTitle title="선물 방송인">
      {fields.map((orderItem, idx) => (
        <OrderItemSupport
          broadcasterId={orderItem.support?.broadcasterId}
          key={orderItem.id}
          orderItemIndex={idx}
        />
      ))}
      <GiftOrderPolicy />
    </SectionWithTitle>
  );
}

export function GiftOrderPolicy(): JSX.Element {
  return (
    <UnorderedList fontSize="xs" mt={3}>
      <ListItem>
        <Text>배송지를 입력하지 않아도 주문상품이 방송인에게 올바르게 배송됩니다.</Text>
      </ListItem>
    </UnorderedList>
  );
}
