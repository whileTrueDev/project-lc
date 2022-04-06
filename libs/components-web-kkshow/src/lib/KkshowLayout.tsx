import { Box } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
import { KkshowNavbar } from './KkshowNavbar';
import { KKshowMainExternLinks } from './main/KKshowMainExternLinks';
import { MobileSearchDrawer } from './search/MobileSearchDrawer';

interface KkshowLayoutProps {
  children: React.ReactNode;
}

export function KkshowLayout({ children }: KkshowLayoutProps): JSX.Element {
  return (
    <Box>
      <KkshowNavbar />
      {children}
      <MobileSearchDrawer />
      <KKshowMainExternLinks mb={-4} bgColor="blue.900" color="whiteAlpha.900" />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
      <BottomQuickMenu />
    </Box>
  );
}

export default KkshowLayout;
