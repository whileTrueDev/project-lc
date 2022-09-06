import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Stack } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminLiveShoppingUpdateForm } from '@project-lc/components-admin/live-shopping/AdminLiveShoppingUpdateForm';
import { LiveShoppingCurrentDataDisplay } from '@project-lc/components-admin/live-shopping/LiveShoppingCurrentDataDisplay';
import { LiveShoppingKkshowGoodsDetailDisplay } from '@project-lc/components-admin/live-shopping/LiveShoppingKkshowGoodsDetailDisplay';
import { LiveShoppingDetailTitle } from '@project-lc/components-admin/LiveShoppingDetailTitle';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function LiveShoppingDetail(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = router.query.liveShoppingId as string;

  const { data: profileData } = useProfile();
  const { data: liveShoppings, isLoading: liveShoppingIsLoading } =
    useAdminLiveShoppingList(
      { id: Number(liveShoppingId) },
      {
        enabled:
          !!profileData?.id && !!liveShoppingId && !Number.isNaN(Number(liveShoppingId)),
      },
    );

  if (liveShoppingIsLoading) return <AdminPageLayout>...loading</AdminPageLayout>;
  if (!liveShoppings) return <AdminPageLayout>...no live-shoppings</AdminPageLayout>;

  const currentLiveShopping = liveShoppings[0];
  if (!currentLiveShopping)
    return <AdminPageLayout>...no live-shopping data</AdminPageLayout>;

  return (
    <AdminPageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={8} p={2} mb={16}>
        <Box as="section">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/live-shopping')}
            >
              목록으로
            </Button>
          </Flex>
        </Box>
        {/* 상품 제목 */}
        {liveShoppings && !liveShoppingIsLoading && (
          <LiveShoppingDetailTitle
            liveShoppingName={currentLiveShopping.liveShoppingName}
            createDate={currentLiveShopping.createDate}
          />
        )}
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="start" gap={4}>
          {/* 현재 라이브쇼핑 데이터 표시 */}
          <LiveShoppingCurrentDataDisplay liveShopping={currentLiveShopping} />
          {/* 라이브쇼핑 정보 변경 폼 */}
          <AdminLiveShoppingUpdateForm liveShopping={currentLiveShopping} />
        </Grid>

        {/* 크크쇼 상품으로 라이브 진행하는 경우 크크쇼 상품 상세정보 표시 */}
        {currentLiveShopping.goodsId && (
          <LiveShoppingKkshowGoodsDetailDisplay goodsId={currentLiveShopping.goodsId} />
        )}
      </Stack>
    </AdminPageLayout>
  );
}

export default LiveShoppingDetail;
