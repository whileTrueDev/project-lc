import { Box, Flex } from '@chakra-ui/react';
import BottomQuickMenu from '@project-lc/components-shared/BottomQuickMenu';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { useKkshowSearchResults } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { SearchResult } from '@project-lc/shared-types';
import KkshowNavbar, { kkshowNavHeight } from '../KkshowNavbar';
import KKshowMainExternLinks from '../main/KKshowMainExternLinks';

export interface SearchPageLayoutProps {
  children?: React.ReactNode;
}
/** search 페이지 기본 레이아웃(네비바, 하단 퀵메뉴, 푸터) */
export function SearchPageLayout({ children }: SearchPageLayoutProps): JSX.Element {
  return (
    <Flex direction="column" overflow="hidden" minHeight="100vh">
      {/* 검색페이지 네비바는 라이트모드에서 흰색배경이라 variant="white" 적용함 */}
      <KkshowNavbar variant="white" />
      <Box flexGrow={1} minH={`calc(100vh - ${kkshowNavHeight}px)`}>
        {children}
      </Box>
      <KKshowMainExternLinks mb={-4} bgColor="blue.900" color="whiteAlpha.900" />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
      <BottomQuickMenu />
    </Flex>
  );
}

export default SearchPageLayout;

/** search 페이지에서 사용하는 keyword, 검색 결과 데이터 state */
export function useSearchPageState(): {
  data?: SearchResult;
  isLoading: boolean;
  searchKeyword?: string;
} {
  const router = useRouter();
  const { keyword } = router.query;

  const searchKeyword = keyword ? (keyword as string) : undefined;

  const [query, setQuery] = useState<string | undefined>(searchKeyword);

  const { data, isLoading } = useKkshowSearchResults(query);

  useEffect(() => {
    setQuery(keyword ? (keyword as string) : undefined);
  }, [keyword]);

  return {
    data,
    isLoading,
    searchKeyword,
  };
}
