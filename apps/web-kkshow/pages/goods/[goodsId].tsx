import { Box, Center, Spinner } from '@chakra-ui/react';
import { PrismaClient } from '@prisma/client';
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
import { GoodsViewStickyNav } from '@project-lc/components-web-kkshow/goods/GoodsViewStickyNav';
import { KkshowNavbar } from '@project-lc/components-web-kkshow/KkshowNavbar';
import { generateGoodsByIdKey, getGoodsById } from '@project-lc/hooks';
import { useGoodsViewStore } from '@project-lc/stores';
import { createQueryClient } from '@project-lc/utils-frontend';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { dehydrate, DehydratedState } from 'react-query';

type KkshowGoodsProps = { dehydratedState: DehydratedState };
type KkshowGoodsParams = { goodsId: string };
export const getStaticPaths: GetStaticPaths<KkshowGoodsParams> = async () => {
  // 빌드 중 getStaticPaths 실행 시 axios의 baseUrl 찾지 못해
  // 올바른 백엔드 엔드포인트 요청하지 못하는 현상으로 여기서 작성.
  // const allGoodsIds = await axios
  //   .get<number[]>(`${getApiHost()}/goods/all-ids`)
  //   .then((res) => res.data);

  // 빌드 환경에서는 API HOST를 찾을수 없으므로 여기서 곧바로 prisma 접근 처리
  const prisma = new PrismaClient();
  // DATABASE_URL=mysql://root:qwer1234@localhost:3306/public
  const goodIds = await prisma.goods.findMany({
    select: { id: true },
    where: { goods_view: { not: 'notLook' } },
  });
  const paths = goodIds.map((g) => ({ params: { goodsId: g.id.toString() } }));
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
export default function GoodsView(): JSX.Element {
  useGoodsScrollNavAutoChange();
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  if (!goodsId) return <Box>올바르지 않은 접근입니다.</Box>;
  if (router.isFallback)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <Box>
      <KkshowNavbar />
      <GoodsViewBreadCrumb />
      <GoodsViewMeta />
      <GoodsViewStickyNav />
      <GoodsViewDetail />
      <GoodsViewReviews />
      <GoodsViewInquiries />
      <GoodsViewAdditionalInfo />
      <GoodsViewFloatingButtons />
      {/* <GoodsViewRelatedGoods /> */}
      <GoodsViewBottomMenu />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}

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

      if (goodsInfo && selected !== 3 && window.scrollY > goodsInfo.offsetTop) {
        handleSelect(3);
      }
      if (
        goodsInfo &&
        goodsInquiries &&
        selected !== 2 &&
        window.scrollY > goodsInquiries.offsetTop &&
        window.scrollY < goodsInfo.offsetTop
      ) {
        handleSelect(2);
      }

      if (
        goodsReview &&
        goodsInquiries &&
        selected !== 1 &&
        window.scrollY > goodsReview.offsetTop &&
        window.scrollY < goodsInquiries.offsetTop
      ) {
        handleSelect(1);
      }

      if (
        goodsContents &&
        goodsReview &&
        selected !== 0 &&
        window.scrollY > goodsContents.offsetTop &&
        window.scrollY < goodsReview.offsetTop
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
