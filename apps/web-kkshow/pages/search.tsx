import { Divider } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SearchResultGoodsSection from '@project-lc/components-web-kkshow/search/SearchResultGoodsSection';
import SearchResultContentsSection from '@project-lc/components-web-kkshow/search/SearchResultContentsSection';
import SearchResultBroadcasterSection from '@project-lc/components-web-kkshow/search/SearchResultBroadcasterSection';
import { useRouter } from 'next/router';

export function Search(): JSX.Element {
  const router = useRouter();
  const { keyword } = router.query;

  const searchKeyword = keyword ? (keyword as string) : undefined;

  return (
    <SearchPageLayout>
      <SearchKeywordSection keyword={searchKeyword} />
      <Divider />
      <SearchResultGoodsSection />
      <Divider />
      <SearchResultContentsSection />
      <Divider />
      <SearchResultBroadcasterSection />
    </SearchPageLayout>
  );
}

export default Search;
