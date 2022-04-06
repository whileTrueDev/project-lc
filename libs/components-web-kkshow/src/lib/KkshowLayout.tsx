import { Box } from '@chakra-ui/react';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { KkshowNavbar } from './KkshowNavbar';
import { MobileSearchDrawer } from './search/MobileSearchDrawer';

interface KkshowLayoutProps {
  children: React.ReactNode;
}

export function KkshowLayout({ children }: KkshowLayoutProps): JSX.Element {
  return (
    <Box>
      <KkshowNavbar />
      {children}
      <BottomQuickMenu />
      <MobileSearchDrawer />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}

export default KkshowLayout;
