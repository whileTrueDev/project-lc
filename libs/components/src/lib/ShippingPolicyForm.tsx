import { Button, Heading, Stack, useToast } from '@chakra-ui/react';
import { useShippingGroupItemStore } from '@project-lc/stores';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicyRelatedGoods from './ShippingPolicyRelatedGoods';
import ShippingPolicySetList from './ShippingPolicySetList';

export function ShippingPolicyForm(): JSX.Element {
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
    const newPolicy = {
      groupName,
      shippingCalculType,
      shippingStdFree,
      shippingAddFree,
      postalCode,
      baseAddress,
      detailAddress,
      shippingSets,
    };
    // 생성 요청
    console.log('shipping policy', newPolicy);
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

      {/* 연결된 상품 */}
      <ShippingPolicyRelatedGoods />

      <Button onClick={saveShippingPolicy}>저장</Button>
    </Stack>
  );
}

export default ShippingPolicyForm;
