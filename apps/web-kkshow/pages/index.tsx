import { Box } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import {
  SellerMainBetaDesktop,
  SellerMainBetaMobile,
} from '@project-lc/components-shared/MainBeta';
import { KkshowNavbar } from '@project-lc/components-web-kkshow/KkshowNavbar';

import { KkshowTogether } from '@project-lc/components-shared/KkshowTogether';
import { useDisplaySize } from '@project-lc/hooks';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  return (
    <Box>
      <KkshowNavbar />

      {isMobileSize ? <SellerMainBetaMobile /> : <SellerMainBetaDesktop />}

      <KkshowTogether />

      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}

export default Index;
