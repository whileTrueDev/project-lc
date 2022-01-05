import { Divider, Stack, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { ShippingSelectOption, TempShippingOption } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { getShippingOptionLabel } from '@project-lc/utils-frontend';

export function ShippingOptionAppliedItem({
  selectOption,
  item,
  onDelete,
}: {
  selectOption: ShippingSelectOption;
  item: TempShippingOption;
  onDelete?: (id: number) => void;
}): JSX.Element {
  const { tempId, shippingCost: costItem } = item;

  const deleteItem = useCallback(() => {
    if (onDelete) {
      onDelete(tempId);
    }
  }, [onDelete, tempId]);

  // costItem이 여러개인 경우 **********************************************
  if (Array.isArray(costItem)) {
    return <Text>미작업</Text>;
  }

  // costItem이 1개인 경우 **********************************************
  const { shipping_area_name: areaName, shipping_cost: cost } = costItem;

  const costText = selectOption.key === 'free' ? '무료' : `${cost.toLocaleString()} 원`;

  return (
    <Tag p={1} pl={!onDelete ? '36px' : undefined}>
      {onDelete && <TagCloseButton onClick={deleteItem} mr={2} />}

      {['free', 'fixed'].includes(selectOption.key) ? (
        // 무료, 고정인 경우
        <TagLabel>{`${areaName} · ${costText}`}</TagLabel>
      ) : (
        // 금액, 가격, 무게 구간입력 구간반복인 경우
        <Stack>
          <TagLabel fontWeight="bold">
            {getShippingOptionLabel(item, selectOption.suffix)}
          </TagLabel>
          <Divider />
          <Text>{`${areaName} · ${costText}`}</Text>
        </Stack>
      )}
    </Tag>
  );
}

export default ShippingOptionAppliedItem;
