import { Divider, Stack, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { ShippingOptionDto, TempShippingOption } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { ShippingSelectOption } from './ShippingOptionTypeSelect';

export function getOptionLabel(item: ShippingOptionDto, suffix: string): string {
  const { section_st: sectionStart, section_ed: sectionEnd } = item;

  const startLabel = sectionStart
    ? `${sectionStart.toLocaleString()} ${suffix} 이상`
    : `0 ${suffix} 이상`;
  const endLabel = sectionEnd ? `${sectionEnd.toLocaleString()} ${suffix} 미만` : '';

  return `${startLabel} ~ ${endLabel}`;
}

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
            {getOptionLabel(item, selectOption.suffix)}
          </TagLabel>
          <Divider />
          <Text>{`${areaName} · ${costText}`}</Text>
        </Stack>
      )}
    </Tag>
  );
}

export default ShippingOptionAppliedItem;
