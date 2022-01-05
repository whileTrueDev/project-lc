import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { useShippingGroupItem } from '@project-lc/hooks';
import {
  ShippingCalculTypeOptions,
  TempShippingOption,
  TempShippingSet,
} from '@project-lc/shared-types';
import ShippingPolicySetListItem from './ShippingPolicySetListItem';

// 배송비 정책 상세 정보
export function ShippingGroupDetail({
  groupId,
}: {
  groupId: number | null;
}): JSX.Element {
  const { data, isLoading } = useShippingGroupItem(groupId);
  if (!groupId) return <Text>잘못된 접근입니다. 선택된 배송비정책 id 없음</Text>;
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!data) return <Text>배송비 정책에 대한 정보가 없습니다</Text>;
  const {
    shipping_group_name,
    shipping_calcul_type,
    baseAddress,
    postalCode,
    detailAddress,
    shippingSets,
  } = data;

  // 타입 맞추기 위한 데이터 형태 변경
  const sets: TempShippingSet[] = shippingSets.map((set) => {
    const {
      id,
      shippingOptions,
      refund_shiping_cost,
      swap_shiping_cost,
      ...restSetData
    } = set;
    const tempOptions: TempShippingOption[] = shippingOptions.map((opt) => {
      const { id: optId, shippingCost, ...restOptData } = opt;
      const { shipping_cost, shipping_area_name } = shippingCost[0];
      return {
        tempId: optId,
        shippingCost: { shipping_cost: Number(shipping_cost), shipping_area_name },
        ...restOptData,
      };
    });
    return {
      tempId: id,
      shippingOptions: tempOptions,
      refund_shiping_cost: Number(refund_shiping_cost),
      swap_shiping_cost: Number(swap_shiping_cost),
      ...restSetData,
    };
  });
  return (
    <Stack>
      <Text> 배송정책 이름 : {shipping_group_name}</Text>
      <Text>
        배송비 계산 기준 : {ShippingCalculTypeOptions[shipping_calcul_type].label}
      </Text>
      <Text>반송지 : {`${baseAddress} ${detailAddress} (${postalCode})`}</Text>
      {sets.map((set) => (
        <ShippingPolicySetListItem key={set.tempId} set={set} />
      ))}
    </Stack>
  );
}

/* 배송비 정책 상세보기 모달 */
export function ShippingGroupDetailModal(
  props: Pick<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'> & {
    groupId: number | null;
  },
): JSX.Element {
  const { isOpen, onClose, onConfirm, groupId } = props;
  return (
    <ConfirmDialog
      title="배송비 정책 정보"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ShippingGroupDetail groupId={groupId} />
    </ConfirmDialog>
  );
}

export default ShippingGroupDetailModal;
