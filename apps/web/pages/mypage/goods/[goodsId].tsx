import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import {
  GoodsDetailInfo,
  GoodsDetailTitle,
  MypageLayout,
  SectionWithTitle,
  SummaryList,
} from '@project-lc/components';
import { useGoodsById } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
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
        <SectionWithTitle title="상품 정보">
          <GoodsDetailInfo goods={goods.data} />
        </SectionWithTitle>

        <pre>{JSON.stringify(goods.data, null, 2)}</pre>
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
