import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import OrderItemSupport from './OrderItemSupport';

export function GiftBox(): JSX.Element {
  const { control } = useFormContext<CreateOrderForm>();
  const { fields } = useFieldArray({ control, name: 'orderItems' });

  return (
    <SectionWithTitle title="선물 방송인">
      {fields.map((orderItem, idx) => (
        <OrderItemSupport
          avatar={orderItem.support?.avatar}
          nickname={orderItem.support?.nickname}
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
        <Text>구매 응원 메시지를 입력하지 않으면 메시지가 전송되지 않습니다.</Text>
      </ListItem>
      <ListItem>
        <Text>
          선물시, 배송지를 입력하지 않아도 주문상품이 방송인에게 올바르게 배송 됩니다.
        </Text>
      </ListItem>
      <ListItem>
        <Text>선물 주문을 취소할 수 있습니다.?</Text>
      </ListItem>
      <ListItem>
        <Text>선물 주문은 주문 완료 이후 취소할 수 없습니다.?</Text>
      </ListItem>
    </UnorderedList>
  );
}
