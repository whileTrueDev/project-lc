import { Container, Divider, Heading, VStack } from '@chakra-ui/react';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { ShopInfoShippingGroup } from '@project-lc/components/ShopInfoShippingGroup';
import { ShopNameSection } from '@project-lc/components/ShopNameSection';

export function ShopInfoIndex(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="2xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <Heading mb={4}>상점설정</Heading>
          <ShopNameSection />
          <Divider />
          <ShopInfoShippingGroup />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default ShopInfoIndex;
