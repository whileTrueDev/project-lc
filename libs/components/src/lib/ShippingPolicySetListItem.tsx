import { Divider, Stack, Text } from '@chakra-ui/layout';
import { CloseButton } from '@chakra-ui/react';
import {
  PrepayInfoOptions,
  ShippingOption,
  ShippingSetFormData,
} from '@project-lc/shared-types';
import { getOptionLabel } from './ShippingOptionAppliedItem';
import { ShippingSelectOptions } from './ShippingOptionTypeSelect';
import { BoldText } from './ShippingPolicySetForm';

function OptionItemDisplay({ item }: { item: ShippingOption }) {
  const { costItem, shippingOptType } = item;
  const selectOption = ShippingSelectOptions.find(
    (select) => select.key === shippingOptType,
  );
  const suffix = selectOption ? selectOption.suffix : '';
  const { areaName, cost } = costItem;
  const costText = shippingOptType === 'free' ? '무료' : `${cost.toLocaleString()} 원`;

  return (
    <Stack direction={{ base: 'column', sm: 'row' }}>
      {/* 무료, 고정 인 경우 범위 표시 안함 */}
      {!['free', 'fixed'].includes(shippingOptType) && (
        <Text>{`${getOptionLabel(item, suffix)} · `}</Text>
      )}
      <Text>{`${areaName} · ${costText}`}</Text>
    </Stack>
  );
}

export function SetItem({
  set,
  onDelete,
}: {
  set: ShippingSetFormData;
  onDelete: (id: number) => void;
}) {
  const {
    shippingSetName,
    prepayInfo,
    refundShippingCost,
    swapShippingCost,
    shipingFreeFlag,
    shippingOptions,
    tempId,
  } = set;

  const stdOptions = shippingOptions.filter((opt) => opt.shippingSetType === 'std');
  const addOptions = shippingOptions.filter((opt) => opt.shippingSetType === 'add');
  return (
    <Stack
      direction="row"
      key={set.tempId}
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={2}
    >
      <CloseButton onClick={() => onDelete(tempId)} />

      <Stack fontSize="sm">
        {/* 배송방법 */}
        <Stack direction="row">
          <BoldText>배송방법</BoldText>
          <Text>{shippingSetName}</Text>
          <Text>{PrepayInfoOptions[prepayInfo].label}</Text>
        </Stack>
        <Divider />

        {/* 반송비 */}
        <Stack direction="row">
          <BoldText>반송비 </BoldText>
          <Stack>
            <Stack direction={{ base: 'column', sm: 'row' }}>
              <Text>
                반품 - 편도 :{' '}
                {refundShippingCost ? refundShippingCost.toLocaleString() : 0} ₩
              </Text>
              {shipingFreeFlag && refundShippingCost && (
                <Text>
                  ( 배송비가 무료인 경우, 왕복 {(refundShippingCost * 2).toLocaleString()}{' '}
                  ₩ 받음 )
                </Text>
              )}
            </Stack>
            <Stack direction="row">
              <Text>
                {' '}
                (맞)교환 - 왕복 :{' '}
                {swapShippingCost ? swapShippingCost.toLocaleString() : 0} ₩
              </Text>
            </Stack>
          </Stack>
        </Stack>
        <Divider />

        {/* 기본 배송비 */}
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <BoldText>기본 배송비</BoldText>
          <Stack>
            {stdOptions.map((opt) => (
              <OptionItemDisplay key={opt.tempId} item={opt} />
            ))}
          </Stack>
        </Stack>
        <Divider />

        {/* 추가 배송비 */}
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <BoldText>추가 배송비</BoldText>
          <Stack>
            {addOptions.length > 0 ? (
              addOptions.map((opt) => <OptionItemDisplay key={opt.tempId} item={opt} />)
            ) : (
              <Text>미사용</Text>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default SetItem;
