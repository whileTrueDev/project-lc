import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export function BroadcasterPromotionPageDetail(): JSX.Element {
  const router = useRouter();
  const promotionPageId = Number(router.query.promotionPageId);
  return (
    <AdminPageLayout>
      <Box position="relative">
        <Heading mt={4}>방송인 상품홍보페이지</Heading>

        <Box>방송인 상품홍보 페이지 상세</Box>
        <Box>페이지 id {promotionPageId}</Box>
      </Box>
    </AdminPageLayout>
  );
}

export default BroadcasterPromotionPageDetail;
