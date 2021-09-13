/* eslint-disable camelcase */
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
