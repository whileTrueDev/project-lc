import { Heading, Container } from '@chakra-ui/react';
import { GoodsRegistForm, MypageLayout } from '@project-lc/components';

export function Goods(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Heading>상품등록</Heading>
        <GoodsRegistForm />
      </Container>
    </MypageLayout>
  );
}

export default Goods;
