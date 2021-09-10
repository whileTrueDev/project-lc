import { Button, Heading, Stack, useToast } from '@chakra-ui/react';
import { DeliveryNation, YesOrNo_UPPERCASE } from '@prisma/client';
import { useCreateShippingGroup } from '@project-lc/hooks';
import { ShippingGroup } from '@project-lc/shared-types';
import { useShippingGroupItemStore } from '@project-lc/stores';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicySetList from './ShippingPolicySetList';

export function ShippingPolicyForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}): JSX.Element {
  const toast = useToast();

  const {
    groupName,
    shippingCalculType,
    shippingStdFree,
    shippingAddFree,
    postalCode,
    baseAddress,
    detailAddress,
    shippingSets,
  } = useShippingGroupItemStore();

  const { mutateAsync, isLoading } = useCreateShippingGroup();

  const saveShippingPolicy = () => {
    // TODO : useShippingGroupItemStore 에서 값 가져와 배송그룹명, 반송지, 배송방법 등록되어 있는지 확인 => 훅으로 분리하기
    if (!groupName) {
      toast({ title: '배송그룹명을 입력해주세요', status: 'error' });
      return;
    }
    if (!postalCode || !detailAddress || !detailAddress) {
      toast({ title: '반송지를 입력해주세요', status: 'error' });
      return;
    }
    if (!shippingSets.length) {
      toast({ title: '배송방법을 추가해주세요', status: 'error' });
      return;
    }

    // TODO: 타입 통일... 혹은 훅으로 분리
    const newGroup: ShippingGroup = {
      shipping_group_name: groupName,
      shipping_calcul_type: shippingCalculType,
      shipping_std_free_yn: shippingStdFree ? YesOrNo_UPPERCASE.Y : YesOrNo_UPPERCASE.N,
      shipping_add_free_yn: shippingAddFree ? YesOrNo_UPPERCASE.Y : YesOrNo_UPPERCASE.N,
      postalCode,
      baseAddress,
      detailAddress,
      shippingSets: shippingSets.map((set) => {
        const {
          shippingSetCode,
          shippingSetName,
          prepayInfo,
          deliveryLimit,
          refundShippingCost,
          swapShippingCost,
          shipingFreeFlag,
          shippingOptions,
        } = set;
        return {
          shipping_set_code: shippingSetCode,
          shipping_set_name: shippingSetName,
          prepay_info: prepayInfo,
          delivery_nation: DeliveryNation.korea, // TODO: global 선택 가능하도록 수정
          delivery_limit: deliveryLimit,
          refund_shiping_cost: refundShippingCost || 0,
          swap_shiping_cost: swapShippingCost || 0,
          shiping_free_yn: shipingFreeFlag ? YesOrNo_UPPERCASE.Y : YesOrNo_UPPERCASE.N,
          shippingOptions: shippingOptions.map((opt) => {
            const {
              shippingSetType,
              shippingOptType,
              sectionStart,
              sectionEnd,
              costItem,
            } = opt;
            return {
              shipping_set_type: shippingSetType,
              shipping_opt_type: shippingOptType,
              // TODO: default_yn 선택 가능하도록 수정
              section_st: sectionStart,
              section_ed: sectionEnd,
              shippingCost: {
                shipping_cost: costItem.cost,
                shipping_area_name: costItem.areaName,
              },
            };
          }),
        };
      }),
    };
    // 생성 요청
    console.log('newGroup', newGroup);

    mutateAsync(newGroup)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Stack p={4} spacing={6}>
      {/* 헤더 */}
      <Heading as="h3" size="lg" textAlign="center">
        배송비 정책
      </Heading>

      {/* 기본정보 */}
      <ShippingPolicyBasicInfo />

      {/* 배송방법 => (퍼스트몰의 배송가능국가 : 대한민국 부분) - 배송 설정, 배송 옵션, 지역별 배송비 정보 */}
      <ShippingPolicySetList />

      {/* 연결된 상품 
      // TODO: 백엔드 작업 후 배송비 수정시 만들 예정
      */}

      <Button onClick={saveShippingPolicy} isLoading={isLoading}>
        저장
      </Button>
    </Stack>
  );
}

export default ShippingPolicyForm;
