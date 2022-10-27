import { Divider, Stack, Text } from '@chakra-ui/layout';
import { CloseButton, Icon } from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { BoldText } from '@project-lc/components-core/BoldText';
import {
  PrepayInfoOptions,
  ShippingOptionDto,
  shippingSelectOptions,
  TempShippingSet,
} from '@project-lc/shared-types';
import { getLocaleNumber, getShippingOptionLabel } from '@project-lc/utils-frontend';
import { FaTruck } from 'react-icons/fa';

export function OptionItemDisplay({
  item,
  isLastOption,
}: {
  item: ShippingOptionDto;
  isLastOption?: boolean;
}): JSX.Element {
  const { shippingCost: costItem, shipping_opt_type: shippingOptType } = item;
  const selectOption = shippingSelectOptions.find(
    (select) => select.key === shippingOptType,
  );
  const suffix = selectOption ? selectOption.suffix : '';
  const { shipping_area_name: areaName, shipping_cost: cost } = costItem;
  const costText = shippingOptType === 'free' ? '무료' : `${getLocaleNumber(cost)} 원`;

  return (
    <Stack direction={{ base: 'column', sm: 'row' }}>
      {/* 무료, 고정 인 경우 범위 표시 안함 */}
      {!['free', 'fixed'].includes(shippingOptType) && (
        <Text>{`${getShippingOptionLabel(item, suffix, isLastOption)} · `}</Text>
      )}
      <Text>{`${areaName} · ${costText}`}</Text>
    </Stack>
  );
}

export function ShippingPolicySetListItem({
  set,
  onDelete,
}: {
  set: TempShippingSet;
  onDelete?: (id: number) => void;
}): JSX.Element {
  const {
    shipping_set_name,
    prepay_info,
    refund_shiping_cost,
    swap_shiping_cost,
    shiping_free_yn,
    shippingOptions,
    tempId,
  } = set;

  const stdOptions = shippingOptions
    .filter((opt) => opt.shipping_set_type === 'std')
    .sort((a, b) => (a.section_st || 0) - (b.section_st || 0)); // 옵션범위 시작값 오름차순으로 정렬
  const addOptions = shippingOptions
    .filter((opt) => opt.shipping_set_type === 'add')
    .sort((a, b) => (a.section_st || 0) - (b.section_st || 0)); // 옵션범위 시작값 오름차순으로 정렬
  return (
    <Stack direction="row" key={set.tempId} {...boxStyle}>
      {onDelete ? (
        <CloseButton onClick={() => onDelete(tempId)} />
      ) : (
        <Icon as={FaTruck} />
      )}

      <Stack fontSize="sm">
        {/* 배송방법 */}
        <Stack direction="row">
          <BoldText>배송방법</BoldText>
          <Text>{shipping_set_name}</Text>
          <Text>{PrepayInfoOptions[prepay_info].label}</Text>
        </Stack>
        <Divider />

        {/* 반송비 */}
        <Stack direction="row">
          <BoldText>반송비 </BoldText>
          <Stack>
            <Stack direction={{ base: 'column', sm: 'row' }}>
              <Text>
                반품 - 편도 :&nbsp;
                {refund_shiping_cost ? getLocaleNumber(refund_shiping_cost) : 0} ₩
              </Text>
              {shiping_free_yn === 'Y' && refund_shiping_cost && (
                <Text>
                  ( 배송비가 무료인 경우, 왕복&nbsp;
                  {getLocaleNumber(refund_shiping_cost * 2)} ₩ 받음 )
                </Text>
              )}
            </Stack>
            <Stack direction="row">
              <Text>
                (맞)교환 - 왕복 :&nbsp;
                {swap_shiping_cost ? getLocaleNumber(swap_shiping_cost) : 0} ₩
              </Text>
            </Stack>
          </Stack>
        </Stack>
        <Divider />

        {/* 기본 배송비 */}
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <BoldText>기본 배송비</BoldText>
          <Stack>
            {stdOptions.map((opt, index) => (
              <OptionItemDisplay
                key={opt.tempId}
                item={opt}
                isLastOption={index === stdOptions.length - 1} // 구간반복 옵션(xx_rep)의 경우 마지막 옵션은 '~당'을 의미함. 이를 변경하기 위해 전달
              />
            ))}
          </Stack>
        </Stack>
        <Divider />

        {/* 추가 배송비 */}
        <Stack direction={{ base: 'column', sm: 'row' }}>
          <BoldText>추가 배송비</BoldText>
          <Stack>
            {addOptions.length > 0 ? (
              addOptions.map((opt, index) => (
                <OptionItemDisplay
                  key={opt.tempId}
                  item={opt}
                  isLastOption={index === addOptions.length - 1} // 구간반복 옵션(xx_rep)의 경우 마지막 옵션은 '~당'을 의미함. 이를 변경하기 위해 전달
                />
              ))
            ) : (
              <Text>X</Text>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ShippingPolicySetListItem;
