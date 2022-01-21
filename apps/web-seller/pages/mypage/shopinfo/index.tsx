import { Container, Divider, VStack } from '@chakra-ui/react';
import { ShopInfoShippingGroup } from '@project-lc/components-seller/ShopInfoShippingGroup';
import { ShopNameSection } from '@project-lc/components-seller/ShopNameSection';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';

export function ShopInfoIndex(): JSX.Element {
  return (
    <MypageLayout>
      <Container maxWidth="3xl" p={6}>
        <VStack spacing={4} alignItems="stretch">
          <ShopNameSection />
          <Divider />
          <ShopInfoShippingGroup />
        </VStack>
      </Container>
    </MypageLayout>
  );
}

export default ShopInfoIndex;
