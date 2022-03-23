import { Box } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import KkshowNavbar from '@project-lc/components-web-kkshow/KkshowNavbar';
import { MarketCarousel } from '@project-lc/components-web-kkshow/market/MarketCarousel';
import { MarketEventBanner } from '@project-lc/components-web-kkshow/market/MarketEventBanner';
import { MarketGoodsOfTheWeek } from '@project-lc/components-web-kkshow/market/MarketGoodsOfTheWeek';
import { MarketNewLineUp } from '@project-lc/components-web-kkshow/market/MarketNewLineUp';
import { MarketPopularGoods } from '@project-lc/components-web-kkshow/market/MarketPopularGoods';
import { MarketRecommendations } from '@project-lc/components-web-kkshow/market/MarketRecommendations';
import { MarketReviews } from '@project-lc/components-web-kkshow/market/MarketReviews';

export default function Market(): JSX.Element {
  return (
    <Box overflow="hidden" position="relative">
      <KkshowNavbar />
      <MarketCarousel />
      <MarketGoodsOfTheWeek />
      <MarketNewLineUp />
      <MarketPopularGoods />
      <MarketEventBanner />
      <MarketRecommendations />
      <MarketReviews />

      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}
