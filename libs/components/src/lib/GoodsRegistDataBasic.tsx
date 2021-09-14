import { HStack, Input, Text } from '@chakra-ui/react';
import SectionWithTitle from './SectionWithTitle';

export function GoodsRegistDataBasic(): JSX.Element {
  return (
    <SectionWithTitle title="기본정보">
      <HStack>
        <Text>상품명 fm_goods.goods_name</Text>
        <Input />
      </HStack>

      <HStack>
        <Text>간략설명 fm_goods.summary</Text>
        <Input />
      </HStack>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataBasic;
