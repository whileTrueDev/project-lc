import { Box, Flex } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import BottomQuickMenu from '@project-lc/components-shared/BottomQuickMenu';
import { useKkshowSearchResults } from '@project-lc/hooks';
import { SearchResult } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import KkshowNavbar from '../KkshowNavbar';
import KKshowMainExternLinks from '../main/KKshowMainExternLinks';

export interface SearchPageLayoutProps {
  children?: React.ReactNode;
}
/** search 페이지 기본 레이아웃(네비바, 하단 퀵메뉴, 푸터) */
export function SearchPageLayout({ children }: SearchPageLayoutProps): JSX.Element {
  return (
    // subNavbar sticky 적용위해 overflow: hidden 삭제함
    <Flex direction="column" minHeight="100vh">
      {/* 검색페이지 네비바는 라이트모드에서 흰색배경이라 variant="white" 적용함 */}
      <KkshowNavbar variant="white" />
      <Box minH="80vh" flexGrow={1}>
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
  const queryClient = useQueryClient();
  const { keyword } = router.query;

  const searchKeyword = keyword ? (keyword as string) : undefined;

  const [query, setQuery] = useState<string | undefined>(searchKeyword);

  const { data, isLoading } = useKkshowSearchResults(query);

  useEffect(() => {
    setQuery(keyword ? (keyword as string) : undefined);
    if (keyword) {
      queryClient.invalidateQueries('getSearchResults');
    }
  }, [keyword, queryClient]);

  return {
    data,
    isLoading,
    searchKeyword,
  };
}
