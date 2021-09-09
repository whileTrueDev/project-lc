import { CloseIcon } from '@chakra-ui/icons';
import { Stack, Text, Tag, TagLabel, TagCloseButton, Divider } from '@chakra-ui/react';
import { ShippingOption } from '@project-lc/shared-types';
import { useCallback } from 'react';
import { ShippingSelectOption } from './ShippingOptionTypeSelect';

function getOptionLabel(selectOption: ShippingSelectOption, item: ShippingOption) {
  const { suffix } = selectOption;
  const { sectionStart, sectionEnd } = item;

  const startLabel = sectionStart
    ? `${sectionStart.toLocaleString()} ${suffix} 이상`
    : '0 이상';
  const endLabel = sectionEnd ? `${sectionEnd.toLocaleString()} ${suffix} 미만` : '';

  return `${startLabel} ~ ${endLabel}`;
}

export function ShippingOptionAppliedItem({
  selectOption,
  item,
  onDelete,
}: {
  selectOption: ShippingSelectOption;
  item: ShippingOption;
  onDelete: (id: number) => void;
}) {
  const { tempId, costItem } = item;

  const deleteItem = useCallback(() => onDelete(tempId), [onDelete, tempId]);

  // costItem이 여러개인 경우 **********************************************
  if (Array.isArray(costItem)) {
    return <Text>미작업</Text>;
  }

  // costItem이 1개인 경우 **********************************************
  const { areaName, cost } = costItem;

  const costText = selectOption.key === 'free' ? '무료' : `${cost.toLocaleString()} 원`;

  return (
    <Tag p={1}>
      <TagCloseButton onClick={deleteItem} mr={2} />

      {['free', 'fixed'].includes(selectOption.key) ? (
        // 무료, 고정인 경우
        <TagLabel>{`${areaName} · ${costText}`}</TagLabel>
      ) : (
        // 금액, 가격, 무게 구간입력 구간반복인 경우
        <Stack>
          <TagLabel fontWeight="bold">{getOptionLabel(selectOption, item)}</TagLabel>
          <Divider />
          <Text>{`${areaName} · ${costText}`}</Text>
        </Stack>
      )}
    </Tag>
  );
}

export default ShippingOptionAppliedItem;
