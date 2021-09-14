import { MypageLayout, ShopNameSection } from '@project-lc/components';
import { Heading, VStack, Divider, Container } from '@chakra-ui/react';

export function ShopInfoIndex(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>상점설정</Heading>
          <ShopNameSection />
          <Divider />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default ShopInfoIndex;
