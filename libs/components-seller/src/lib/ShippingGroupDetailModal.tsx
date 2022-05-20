import { Center, Spinner, Stack, Text } from '@chakra-ui/react';
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from '@project-lc/components-core/ConfirmDialog';
import { ShippingGroupSets } from '@project-lc/components-shared/shipping/ShippingGroupSets';
import { useShippingGroupItem } from '@project-lc/hooks';
import { ShippingCalculTypeOptions } from '@project-lc/shared-types';

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

  return (
    <Stack>
      <Text> 배송정책 이름 : {shipping_group_name}</Text>
      <Text>
        배송비 계산 기준 : {ShippingCalculTypeOptions[shipping_calcul_type].label}
      </Text>
      <Text>반송지 : {`${baseAddress} ${detailAddress} (${postalCode})`}</Text>
      <ShippingGroupSets shippingSets={shippingSets} />
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
