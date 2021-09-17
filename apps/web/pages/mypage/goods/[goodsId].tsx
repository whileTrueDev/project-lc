import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import {
  GoodsDetailCommonInfo,
  GoodsDetailImagesInfo,
  GoodsDetailInfo,
  GoodsDetailOptionsInfo,
  GoodsDetailPurchaseLimitInfo,
  GoodsDetailShippingInfo,
  GoodsDetailTitle,
  MypageLayout,
  SectionWithTitle,
  SummaryList,
} from '@project-lc/components';
import { useGoodsById } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import React from 'react';
import { MdDateRange } from 'react-icons/md';

export function GoodsDetail(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (goods.isLoading) return <MypageLayout>...loading</MypageLayout>;

  if (!goods.isLoading && !goods.data) return <MypageLayout>...no data</MypageLayout>;

  return (
    <MypageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={6} p={2}>
        <Box as="section">
          <Button
            size="sm"
            leftIcon={<ChevronLeftIcon />}
            onClick={() => router.push('/mypage/goods')}
          >
            목록으로
          </Button>
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

        <SectionWithTitle title="배송정책">
          <GoodsDetailShippingInfo goods={goods.data} />
        </SectionWithTitle>
      </Stack>
    </MypageLayout>
  );
}

export default GoodsDetail;

export interface GoodsDetailActionsProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailActions({ goods }: GoodsDetailActionsProps) {
  return (
    <HStack>
      <Button>버튼1</Button>
      <Button>버튼2</Button>
    </HStack>
  );
}

export interface GoodsDetailSummaryProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailSummary({ goods }: GoodsDetailSummaryProps) {
  return (
    <SummaryList
      listItems={[
        {
          id: 'asdf',
          value: 'asdf',
          icon: MdDateRange,
        },
        {
          id: 'asdf2',
          value: 'asdf2',
          icon: MdDateRange,
        },
        {
          id: 'asdf3',
          value: 'asdf3',
          icon: MdDateRange,
        },
        {
          id: 'asdf4',
          value: 'asdf4',
          icon: MdDateRange,
        },
      ]}
    />
  );
}
