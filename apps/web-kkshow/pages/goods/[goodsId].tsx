import { Box, Center, Spinner } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { GoodsViewAdditionalInfo } from '@project-lc/components-web-kkshow/goods/GoodsViewAdditionalInfo';
import { GoodsViewBottomMenu } from '@project-lc/components-web-kkshow/goods/GoodsViewBottomMenu';
import { GoodsViewBreadCrumb } from '@project-lc/components-web-kkshow/goods/GoodsViewBreadCrumb';
import { GoodsViewDetail } from '@project-lc/components-web-kkshow/goods/GoodsViewDetail';
import { GoodsViewFloatingButtons } from '@project-lc/components-web-kkshow/goods/GoodsViewFloatingButtons';
import { GoodsViewInquiries } from '@project-lc/components-web-kkshow/goods/GoodsViewInquiries';
import { GoodsViewMeta } from '@project-lc/components-web-kkshow/goods/GoodsViewMeta';
import { GoodsViewReviews } from '@project-lc/components-web-kkshow/goods/GoodsViewReviews';
import { GoodsViewNavBar } from '@project-lc/components-web-kkshow/goods/nav/GoodsViewNavBar';
import { GoodsViewStickyNav } from '@project-lc/components-web-kkshow/goods/nav/GoodsViewStickyNav';
import { KkshowNavbar } from '@project-lc/components-web-kkshow/KkshowNavbar';
import {
  ALL_GOODS_IDS_KEY,
  generateGoodsByIdKey,
  getAllGoodsIds,
  getGoodsById,
} from '@project-lc/hooks';
import { AllGoodsIdsRes } from '@project-lc/shared-types';
import { useGoodsViewStore } from '@project-lc/stores';
import { createQueryClient } from '@project-lc/utils-frontend';
import { AxiosError } from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, DehydratedState } from 'react-query';

export default function GoodsView(): JSX.Element {
  useGoodsScrollNavAutoChange();
  const router = useRouter();
  if (router.isFallback)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <Box>
      <Box display={{ base: 'none', md: 'block' }}>
        <KkshowNavbar firstLink="kkmarket" />
      </Box>
      <GoodsViewNavBar />
      <GoodsViewBreadCrumb />
      <GoodsViewMeta />
      <GoodsViewStickyNav />
      <GoodsViewDetail />
      <GoodsViewReviews />
      <GoodsViewInquiries />
      <GoodsViewAdditionalInfo />
      <GoodsViewFloatingButtons />
      <GoodsViewBottomMenu />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}

type KkshowGoodsProps = { dehydratedState: DehydratedState };
type KkshowGoodsParams = { goodsId: string };
export const getStaticPaths: GetStaticPaths<KkshowGoodsParams> = async () => {
  const queryClient = createQueryClient();
  const goodIds = await queryClient.fetchQuery<AllGoodsIdsRes, AxiosError>(
    ALL_GOODS_IDS_KEY,
    { queryFn: getAllGoodsIds },
  );
  const paths = goodIds.map((gid) => ({ params: { goodsId: gid.id.toString() } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<
  KkshowGoodsProps,
  KkshowGoodsParams
> = async ({ params }) => {
  const queryClient = createQueryClient();
  await queryClient
    .prefetchQuery(generateGoodsByIdKey(params.goodsId), () =>
      getGoodsById(params.goodsId),
    )
    .catch((err) => {
      throw new Error(
        `Failed to fetch KkshowGoods data goodsId${params.goodsId} - ${err}`,
      );
    });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

/** GoodsStickNav 선택된 nav 자동 변경 훅 */
const useGoodsScrollNavAutoChange = (): void => {
  const selected = useGoodsViewStore((s) => s.selectedNavIdx);
  const handleSelect = useGoodsViewStore((s) => s.handleSelectNav);

  useEffect(() => {
    const scrollListener = (): void => {
      const goodsContents = document.getElementById('goods-contents');
      const goodsReview = document.getElementById('goods-reviews');
      const goodsInquiries = document.getElementById('goods-inquiries');
      const goodsInfo = document.getElementById('goods-info');

      if (goodsInfo && selected !== 3 && window.scrollY > goodsInfo.offsetTop - 30) {
        handleSelect(3);
      }
      if (
        goodsInfo &&
        goodsInquiries &&
        selected !== 2 &&
        window.scrollY > goodsInquiries.offsetTop &&
        window.scrollY < goodsInfo.offsetTop - 30
      ) {
        handleSelect(2);
      }

      if (
        goodsReview &&
        goodsInquiries &&
        selected !== 1 &&
        window.scrollY > goodsReview.offsetTop &&
        window.scrollY < goodsInquiries.offsetTop - 30
      ) {
        handleSelect(1);
      }

      if (
        goodsContents &&
        goodsReview &&
        selected !== 0 &&
        window.scrollY > goodsContents.offsetTop &&
        window.scrollY < goodsReview.offsetTop - 30
      ) {
        handleSelect(0);
      }
    };
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  });
};
