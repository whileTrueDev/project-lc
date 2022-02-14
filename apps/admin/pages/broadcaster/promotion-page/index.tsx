import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { Box, Heading, Text } from '@chakra-ui/react';
import AdminBroadcasterPromotionPageList from '@project-lc/components-admin/AdminBroadcasterPromotionPageList';
import { AdminBroadcasterPromotionPageCreateSection } from '@project-lc/components-admin/AdminBroadcasterPromotionPageCreateSection';

export function BroadcasterPromotionPageIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box position="relative">
        <Heading mt={4}>방송인 상품홍보페이지</Heading>

        <AdminBroadcasterPromotionPageCreateSection />

        <Text>방송인 상품홍보 페이지 목록</Text>
        <AdminBroadcasterPromotionPageList />
      </Box>
    </AdminPageLayout>
  );
}

export default BroadcasterPromotionPageIndex;
