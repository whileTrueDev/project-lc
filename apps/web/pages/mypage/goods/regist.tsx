import { Heading } from '@chakra-ui/react';
import { GoodsRegistForm, MypageLayout } from '@project-lc/components';

export function Goods(): JSX.Element {
  return (
    <MypageLayout>
      <Heading>상품등록</Heading>
      <GoodsRegistForm />
    </MypageLayout>
  );
}

export default Goods;
