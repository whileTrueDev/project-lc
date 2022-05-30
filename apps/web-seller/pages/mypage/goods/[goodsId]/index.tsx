import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Spinner, Stack } from '@chakra-ui/react';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { GoodsDetailActions } from '@project-lc/components-seller/goods-detail/GoodsDetailActions';
import { GoodsDetailCommonInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailCommonInfo';
import { GoodsDetailImagesInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailImagesInfo';
import { GoodsDetailInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailInfo';
import { GoodsDetailKeywords } from '@project-lc/components-seller/goods-detail/GoodsDetailKeywords';
import { GoodsDetailMemo } from '@project-lc/components-seller/goods-detail/GoodsDetailMemo';
import { GoodsDetailOptionsInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailOptionsInfo';
import { GoodsDetailPurchaseLimitInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailPurchaseLimitInfo';
import { GoodsDetailShippingInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailShippingInfo';
import { GoodsDetailSummary } from '@project-lc/components-seller/goods-detail/GoodsDetailSummary';
import { GoodsDetailTitle } from '@project-lc/components-seller/goods-detail/GoodsDetailTitle';
import GoodsEditButton from '@project-lc/components-seller/GoodsEditButton';
import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';

export function GoodsDetail(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (goods.isLoading)
    return (
      <MypageLayout>
        <Center>
          <Spinner />
        </Center>
      </MypageLayout>
    );

  if (!goods.isLoading && !goods.data) return <MypageLayout>...no data</MypageLayout>;

  return (
    <MypageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={8} p={2} mb={16}>
        <Box as="section">
          <Stack direction="row">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/mypage/goods')}
            >
              목록으로
            </Button>
          </Stack>
        </Box>

        {/* 상품 제목 */}
        <Box as="section">
          <GoodsDetailTitle goods={goods.data} />
        </Box>

        {/* 상품 버튼 */}
        <Box as="section">
          <Box pb={2}>
            <GoodsEditButton goods={goods.data} />
          </Box>
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

        {goods.data.searchKeyword && (
          <SectionWithTitle title="키워드">
            <GoodsDetailKeywords goods={goods.data} />
          </SectionWithTitle>
        )}

        {goods.data.ShippingGroup && (
          <SectionWithTitle title="배송정책">
            <GoodsDetailShippingInfo goods={goods.data} />
          </SectionWithTitle>
        )}

        <SectionWithTitle title="메모">
          <GoodsDetailMemo goods={goods.data} />
        </SectionWithTitle>
      </Stack>
    </MypageLayout>
  );
}

export default GoodsDetail;
