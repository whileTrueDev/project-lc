import { Box } from '@chakra-ui/react';
import BottomQuickMenu from '@project-lc/components-shared/BottomQuickMenu';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import KKshowMainExternLinks from '../main/KKshowMainExternLinks';
import KkshowNavbar from '../KkshowNavbar';

export interface SearchPageLayoutProps {
  children?: React.ReactNode;
}
export function SearchPageLayout({ children }: SearchPageLayoutProps): JSX.Element {
  return (
    <Box overflow="hidden">
      {/* 검색페이지 네비바는 라이트모드에서 흰색배경이라 variant="white" 적용함 */}
      <KkshowNavbar variant="white" />

      {/* //TODO: 최소높이 지정을 어떻게 하지?? */}
      <Box minHeight={{ base: '500px', sm: '800px' }}>{children}</Box>

      <BottomQuickMenu />

      <KKshowMainExternLinks mb={-4} bgColor="blue.900" color="whiteAlpha.900" />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}

export default SearchPageLayout;
