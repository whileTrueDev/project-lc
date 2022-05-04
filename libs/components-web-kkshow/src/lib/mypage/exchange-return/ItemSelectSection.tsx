import { Checkbox, Stack } from '@chakra-ui/react';
import { OrderDetailRes } from '@project-lc/shared-types';
import { useEffect } from 'react';
import { OrderItemOptionInfo } from '../orderList/OrderItemOptionInfo';

export type SelectedOrderItem = {
  orderItemId: number;
  orderItemOptionId: number;
  amount: number;
};

export interface ItemSelectSectionProps {
  propname?: any;
  orderItems: OrderDetailRes['orderItems'];
  selectedItems: SelectedOrderItem[];
  onChange: (items: SelectedOrderItem[]) => void;
}

export function ItemSelectSection({
  propname,
  orderItems,
  selectedItems,
  onChange,
}: ItemSelectSectionProps): JSX.Element {
  useEffect(() => {
    if (orderItems) {
      const all = orderItems.flatMap((item) =>
        item.options.map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          amount: opt.quantity,
        })),
      );
      onChange(all);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Stack>
      주문상품목록 표시 및 체크박스로 선택된 상품 변경가능
      {/* 주문상품옵션 1개당 주문목록아이템 1개 생성 */}
      {orderItems.flatMap((item) =>
        item.options.map((opt) => (
          <Checkbox
            isChecked={!!selectedItems.find((item) => item.orderItemOptionId === opt.id)}
            onChange={() => {
              console.log(selectedItems);
            }}
          >
            <OrderItemOptionInfo
              key={opt.id}
              option={opt}
              orderItem={item}
              displayStatus={false}
            />
          </Checkbox>
        )),
      )}
    </Stack>
  );
}

export default ItemSelectSection;
