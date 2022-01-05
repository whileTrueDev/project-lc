import { Button, Heading, Stack } from '@chakra-ui/react';
import { useSaveShippingGroup } from '@project-lc/hooks';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicySetList from './ShippingPolicySetList';

export function ShippingPolicyForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}): JSX.Element {
  const { saveShippingPolicy, isLoading } = useSaveShippingGroup({ onSuccess });

  return (
    <Stack p={4} spacing={6}>
      {/* 헤더 */}
      <Heading as="h3" size="lg" textAlign="center">
        배송비 정책
      </Heading>

      {/* 기본정보 - 배송그룹명, 배송비 계산 기준, 배송비 추가 설정, 반송지 */}
      <ShippingPolicyBasicInfo />

      {/* 배송방법 => (퍼스트몰의 배송가능국가 : 대한민국 부분) - 배송 설정, 배송 옵션, 지역별 배송비 정보 */}
      <ShippingPolicySetList />

      <Button onClick={saveShippingPolicy} isLoading={isLoading}>
        저장
      </Button>
    </Stack>
  );
}

export default ShippingPolicyForm;
