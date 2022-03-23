import { Box } from '@chakra-ui/react';
import KkshowNavbar from '@project-lc/components-web-kkshow/KkshowNavbar';
import { MarketCarousel } from '@project-lc/components-web-kkshow/market/MarketCarousel';

export default function Market(): JSX.Element {
  return (
    <Box>
      <KkshowNavbar />
      <MarketCarousel />
    </Box>
  );
}
