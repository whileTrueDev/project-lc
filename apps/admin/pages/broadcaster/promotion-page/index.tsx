import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { Box, Heading, Text } from '@chakra-ui/react';
import AdminBroadcasterPromotionPageList from '@project-lc/components-admin/AdminBroadcasterPromotionPageList';

export function BroadcasterPromotionPageIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box position="relative">
        <Heading mt={4}>방송인 상품홍보페이지</Heading>

        <Box>방송인 상품홍보 페이지 목록</Box>
        <AdminBroadcasterPromotionPageList />
        <Box>생성버튼과 모달</Box>

        <Text fontSize="lg" fontWeight="medium" pb={1}>
          방송인 상품홍보 페이지 목록과 생성버튼 필요
        </Text>
      </Box>
    </AdminPageLayout>
  );
}

export default BroadcasterPromotionPageIndex;
