import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { AdminGoodsStatusButtons } from '@project-lc/components-admin/AdminGoodsStatusButtons';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { GoodsDetailActions } from '@project-lc/components-seller/GoodsDetailActions';
import { GoodsDetailCommonInfo } from '@project-lc/components-seller/GoodsDetailCommonInfo';
import { GoodsDetailImagesInfo } from '@project-lc/components-seller/GoodsDetailImagesInfo';
import { GoodsDetailInfo } from '@project-lc/components-seller/GoodsDetailInfo';
import { GoodsDetailOptionsInfo } from '@project-lc/components-seller/GoodsDetailOptionsInfo';
import { GoodsDetailPurchaseLimitInfo } from '@project-lc/components-seller/GoodsDetailPurchaseLimitInfo';
import { GoodsDetailShippingInfo } from '@project-lc/components-seller/GoodsDetailShippingInfo';
import { GoodsDetailSummary } from '@project-lc/components-seller/GoodsDetailSummary';
import { GoodsDetailTitle } from '@project-lc/components-seller/GoodsDetailTitle';
import { useAdminGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function GoodsDetail(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useAdminGoodsById(goodsId);

  if (goods.isLoading) return <AdminPageLayout>...loading</AdminPageLayout>;

  if (!goods.isLoading && !goods.data)
    return <AdminPageLayout>...no data</AdminPageLayout>;

  return (
    <AdminPageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={8} p={2} mb={16}>
        <Box as="section">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/goods')}
            >
              목록으로
            </Button>
            {/* 상품 검수를 위한 버튼 */}
            <AdminGoodsStatusButtons goods={goods.data} />
          </Flex>
        </Box>
        {/* 상품 제목 */}
        <Box as="section">
          <GoodsDetailTitle goods={goods.data} />
        </Box>

        {/* 상품 버튼 */}
        <Box as="section">
          <GoodsDetailActions goods={goods.data} />
        </Box>

        {/* 상품 요약 */}
        <Box as="section">
          <GoodsDetailSummary goods={goods.data} />
        </Box>

        {/* 상품 정보 */}

        <SectionWithTitle title="기본 정보">
          <GoodsDetailInfo goods={goods.data} />
        </SectionWithTitle>

        <SectionWithTitle title="상품사진 및 설명">
          <GoodsDetailImagesInfo goods={goods.data} />
        </SectionWithTitle>

        <SectionWithTitle title="옵션">
          <GoodsDetailOptionsInfo goods={goods.data} />
        </SectionWithTitle>

        <SectionWithTitle title="상품 공통 정보">
          <GoodsDetailCommonInfo goods={goods.data} />
        </SectionWithTitle>

        <SectionWithTitle title="구매 제한">
          <GoodsDetailPurchaseLimitInfo goods={goods.data} />
        </SectionWithTitle>

        {goods.data.ShippingGroup && (
          <SectionWithTitle title="배송정책">
            <GoodsDetailShippingInfo goods={goods.data} />
          </SectionWithTitle>
        )}
      </Stack>
    </AdminPageLayout>
  );
}

export default GoodsDetail;
