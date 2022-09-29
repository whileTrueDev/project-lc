import { Box } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
import { KkshowNavbarVariant } from '@project-lc/shared-types';
import { KkshowEventPopupsSection } from './EventPopup';
import { KkshowNavbar, KkshowNavbarProps } from './KkshowNavbar';
import { KKshowMainExternLinks } from './main/KKshowMainExternLinks';

interface KkshowLayoutProps {
  children: React.ReactNode;
  disableQuickMenu?: boolean;
  navbarVariant?: KkshowNavbarVariant;
  navbarFirstLink?: KkshowNavbarProps['firstLink'];
}

export function KkshowLayout({
  children,
  disableQuickMenu = false,
  navbarVariant,
  navbarFirstLink = 'kkshow',
}: KkshowLayoutProps): JSX.Element {
  return (
    <Box>
      <KkshowNavbar variant={navbarVariant} firstLink={navbarFirstLink} />
      {children}
      <KKshowMainExternLinks mb={-4} bgColor="blue.900" color="whiteAlpha.900" />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
      {!disableQuickMenu && <BottomQuickMenu />}
      <KkshowEventPopupsSection />
    </Box>
  );
}

export default KkshowLayout;
