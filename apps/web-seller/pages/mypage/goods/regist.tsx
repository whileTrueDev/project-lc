import { Container } from '@chakra-ui/react';
import { GoodsRegistForm } from '@project-lc/components-seller/GoodsRegistForm';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';

export function GoodsRegist(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <GoodsRegistForm />
      </Container>
    </MypageLayout>
  );
}

export default GoodsRegist;
