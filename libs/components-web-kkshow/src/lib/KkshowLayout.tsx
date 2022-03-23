import { Box } from '@chakra-ui/react';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
import { KkshowNavbar } from './KkshowNavbar';

interface KkshowLayoutProps {
  children: React.ReactNode;
}

export function KkshowLayout({ children }: KkshowLayoutProps): JSX.Element {
  return (
    <Box>
      <KkshowNavbar />
      {children}
      <BottomQuickMenu />
    </Box>
  );
}

export default KkshowLayout;
