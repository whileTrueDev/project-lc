import { Box, useBreakpoint } from '@chakra-ui/react';
import MypageFooter from './MypageFooter';
import { MypageNavbar } from './MypageNavbar';
import { Navbar } from './Navbar';

interface MypageLayoutProps {
  children: React.ReactNode;
}

export function MypageLayout({ children }: MypageLayoutProps): JSX.Element {
  return (
    <Box>
      <Navbar />

      <MypageNavbar />

      <Box as="main" minH="calc(100vh - 60px - 60px - 60px)">
        {children}
      </Box>

      <MypageFooter />
    </Box>
  );
}

export default MypageLayout;
