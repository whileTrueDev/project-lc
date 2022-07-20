import { Box, Button, Divider, Text } from '@chakra-ui/react';
import { AdminBroadcasterProductPromotionSection } from '@project-lc/components-admin/AdminBroadcasterProductPromotionSection';
import { AdminBroadcasterPromotionPageDetail } from '@project-lc/components-admin/AdminBroadcasterPromotionPageDetail';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { useAdminBroadcasterPromotionPage } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function BroadcasterPromotionPageDetail(): JSX.Element {
  const router = useRouter();
  const goBackToList = useCallback(() => {
    router.push('/broadcaster/promotion-page');
  }, [router]);
  const promotionPageId = Number(router.query.promotionPageId);

  // 데이터
  const { data: listData, isLoading } = useAdminBroadcasterPromotionPage();

  if (isLoading) return <Text>로딩중...</Text>;

  const pageData = listData.find((item) => item.id === promotionPageId);
  if (!pageData)
    return (
      <AdminPageLayout>
        <Text>존재하지 않는 방송인 상품홍보페이지 입니다</Text>
        <Button onClick={goBackToList}>돌아가기</Button>
      </AdminPageLayout>
    );

  return (
    <AdminPageLayout>
      <Box position="relative">
        <Button onClick={goBackToList}>돌아가기</Button>
        {/* 상품홍보페이지 정보 - 페이지id, 방송인명, url */}
        <AdminBroadcasterPromotionPageDetail
          pageData={pageData}
          promotionPageId={promotionPageId}
          onDeleteSuccess={goBackToList}
        />

        <Divider my={10} />

        {/* 상품홍보페이지에 연결된 상품홍보 영역 */}
        <AdminBroadcasterProductPromotionSection
          promotionPageId={promotionPageId}
          broadcasterId={pageData.broadcasterId}
        />
      </Box>
    </AdminPageLayout>
  );
}

export default BroadcasterPromotionPageDetail;
