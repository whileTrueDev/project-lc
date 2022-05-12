import { Box, Button, Checkbox, Stack, Text } from '@chakra-ui/react';
import { OrderDetailRes } from '@project-lc/shared-types';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { OrderItemOptionInfo } from '../orderList/OrderItemOptionInfo';

export type SelectedOrderItem = {
  orderItemId: number;
  orderItemOptionId: number;
  amount: number;
};

export interface ItemSelectSectionProps {
  orderItems: OrderDetailRes['orderItems'];
  selectedItems: SelectedOrderItem[];
  setSelectedItems: Dispatch<SetStateAction<SelectedOrderItem[]>>;
}

export function ItemSelectSection({
  orderItems,
  selectedItems,
  setSelectedItems,
}: ItemSelectSectionProps): JSX.Element {
  const selectAll = useCallback(() => {
    if (orderItems) {
      const all = orderItems.flatMap((item) =>
        item.options.map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          amount: opt.quantity,
        })),
      );
      setSelectedItems(all);
    }
  }, [orderItems, setSelectedItems]);

  useEffect(() => {
    selectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <Text fontWeight="bold">재배송/환불 신청할 상품을 선택해주세요</Text>
      <Box>
        <Button size="xs" onClick={selectAll}>
          전체선택
        </Button>
      </Box>

      {/* 주문상품옵션 1개당 주문목록아이템 1개 생성 */}
      {orderItems.flatMap((item) =>
        item.options.map((opt) => {
          const isChecked = !!selectedItems.find(
            (selectedItem) => selectedItem.orderItemOptionId === opt.id,
          );
          return (
            <Checkbox
              key={opt.id}
              isChecked={isChecked}
              onChange={() => {
                if (isChecked) {
                  setSelectedItems((state) =>
                    state.filter((_item) => _item.orderItemOptionId !== opt.id),
                  );
                } else {
                  setSelectedItems((state) => [
                    ...state,
                    {
                      orderItemId: item.id,
                      orderItemOptionId: opt.id,
                      amount: opt.quantity,
                    },
                  ]);
                }
              }}
            >
              <OrderItemOptionInfo
                key={opt.id}
                option={opt}
                orderItem={item}
                displayStatus={false}
              />
            </Checkbox>
          );
        }),
      )}
    </Stack>
  );
}

export default ItemSelectSection;
