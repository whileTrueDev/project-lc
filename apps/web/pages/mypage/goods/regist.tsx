import { Container, Heading } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { GoodsRegistForm } from '@project-lc/components/GoodsRegistForm';

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
