import { Text, Stack } from '@chakra-ui/react';
import SectionWithTitle from './SectionWithTitle';

export function ShippingPolicyRelatedGoods(): JSX.Element {
  return (
    <SectionWithTitle title="연결된 상품">
      <Stack direction="row">
        <Text>배송그룹에 연결되어 있는 상품의 개수 :</Text>
        <Text>???</Text>
      </Stack>
    </SectionWithTitle>
  );
}

export default ShippingPolicyRelatedGoods;
