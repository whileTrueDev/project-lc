import { Box } from '@chakra-ui/react';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
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
    </Box>
  );
}

export default KkshowLayout;
