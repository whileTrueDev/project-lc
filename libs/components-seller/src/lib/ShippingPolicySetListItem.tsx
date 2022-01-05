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
import { getShippingOptionLabel } from '@project-lc/utils-frontend';
import { FaTruck } from 'react-icons/fa';

function OptionItemDisplay({ item }: { item: ShippingOptionDto }): JSX.Element {
  const { shippingCost: costItem, shipping_opt_type: shippingOptType } = item;
  const selectOption = shippingSelectOptions.find(
    (select) => select.key === shippingOptType,
  );
  const suffix = selectOption ? selectOption.suffix : '';
  const { shipping_area_name: areaName, shipping_cost: cost } = costItem;
  const costText = shippingOptType === 'free' ? '무료' : `${cost.toLocaleString()} 원`;

  return (
    <Stack direction={{ base: 'column', sm: 'row' }}>
      {/* 무료, 고정 인 경우 범위 표시 안함 */}
      {!['free', 'fixed'].includes(shippingOptType) && (
        <Text>{`${getShippingOptionLabel(item, suffix)} · `}</Text>
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

  const stdOptions = shippingOptions.filter((opt) => opt.shipping_set_type === 'std');
  const addOptions = shippingOptions.filter((opt) => opt.shipping_set_type === 'add');
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
                {refund_shiping_cost ? refund_shiping_cost.toLocaleString() : 0} ₩
              </Text>
              {shiping_free_yn === 'Y' && refund_shiping_cost && (
                <Text>
                  ( 배송비가 무료인 경우, 왕복&nbsp;
                  {(refund_shiping_cost * 2).toLocaleString()} ₩ 받음 )
                </Text>
              )}
            </Stack>
            <Stack direction="row">
              <Text>
                (맞)교환 - 왕복 :&nbsp;
                {swap_shiping_cost ? swap_shiping_cost.toLocaleString() : 0} ₩
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

export default ShippingPolicySetListItem;
