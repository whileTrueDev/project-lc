import { useToast } from '@chakra-ui/react';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { useShippingGroupItemStore, useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';
import { useCreateShippingGroup } from './mutation/useCreateShippingGroup';

// 배송비 정책 생성 요청 훅 **********************************
export const useSaveShippingGroup = ({ onSuccess }: { onSuccess?: () => void }) => {
  const toast = useToast();

  const {
    shipping_group_name,
    shipping_calcul_type,
    shipping_std_free_yn,
    shipping_add_free_yn,
    postalCode,
    baseAddress,
    detailAddress,
    shippingSets,
    shipping_calcul_free_yn,
  } = useShippingGroupItemStore();

  const { mutateAsync, isLoading } = useCreateShippingGroup();
  const saveShippingPolicy = useCallback(() => {
    // TODO : useShippingGroupItemStore 에서 값 가져와 배송그룹명, 반송지, 배송방법 등록되어 있는지 확인 => 훅으로 분리하기
    if (!shipping_group_name) {
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

    const newGroup: ShippingGroupDto = {
      shipping_group_name,
      shipping_calcul_type,
      shipping_std_free_yn,
      shipping_add_free_yn,
      postalCode,
      baseAddress,
      detailAddress,
      shippingSets,
      shipping_calcul_free_yn,
    };
    mutateAsync(newGroup)
      .then(() => {
        toast({ title: '배송비 정책 생성 성공', status: 'success' });
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast({ title: '배송비 정책 생성 오류', status: 'error' });
        console.error(error);
      });
  }, [
    baseAddress,
    detailAddress,
    mutateAsync,
    onSuccess,
    postalCode,
    shippingSets,
    shipping_add_free_yn,
    shipping_calcul_free_yn,
    shipping_calcul_type,
    shipping_group_name,
    shipping_std_free_yn,
    toast,
  ]);
  return {
    saveShippingPolicy,
    isLoading,
  };
};

// 배송방법 추가 훅 **********************************
export const useAddShippingSetHandler = ({ onSubmit }: { onSubmit: () => void }) => {
  const toast = useToast();
  const {
    shipping_set_name,
    shipping_set_code,
    prepay_info,
    refund_shiping_cost,
    swap_shiping_cost,
    shiping_free_yn,
    delivery_limit,
    shippingOptions,
  } = useShippingSetItemStore();

  const { addShippingSet } = useShippingGroupItemStore();

  const addShippingSetHandler = useCallback(() => {
    if (shippingOptions.filter((opt) => opt.shipping_set_type === 'std').length === 0) {
      toast({ title: '기본배송비 옵션을 1개 이상 적용해야 합니다', status: 'error' });
      return;
    }
    addShippingSet({
      shipping_set_code,
      shipping_set_name,
      prepay_info,
      refund_shiping_cost,
      swap_shiping_cost,
      shiping_free_yn,
      shippingOptions,
      delivery_limit,
      default_yn: 'N',
      delivery_nation: 'korea',
    });
    onSubmit();
  }, [
    addShippingSet,
    delivery_limit,
    onSubmit,
    prepay_info,
    refund_shiping_cost,
    shiping_free_yn,
    shippingOptions,
    shipping_set_code,
    shipping_set_name,
    swap_shiping_cost,
    toast,
  ]);

  return {
    addShippingSetHandler,
  };
};
