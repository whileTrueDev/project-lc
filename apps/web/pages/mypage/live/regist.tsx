import { MypageLayout, LiveShoppingRegist } from '@project-lc/components';
import { Heading, Container } from '@chakra-ui/react';

export function Live(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="container.xl" my={12}>
        <Heading>라이브 쇼핑 등록</Heading>
        <LiveShoppingRegist />
      </Container>
    </MypageLayout>
  );
}

export default Live;
