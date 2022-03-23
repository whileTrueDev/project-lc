import { Divider, Spinner } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SearchResultGoodsSection from '@project-lc/components-web-kkshow/search/SearchResultGoodsSection';
import SearchResultContentsSection from '@project-lc/components-web-kkshow/search/SearchResultContentsSection';
import SearchResultBroadcasterSection from '@project-lc/components-web-kkshow/search/SearchResultBroadcasterSection';
import { useRouter } from 'next/router';
import { useKkshowSearchResult } from '@project-lc/hooks';
import { useEffect, useState } from 'react';

export function Search(): JSX.Element {
  const router = useRouter();
  const { keyword } = router.query;

  const searchKeyword = keyword ? (keyword as string) : undefined;

  const [query, setQuery] = useState<string | undefined>(searchKeyword);

  const { data, isLoading } = useKkshowSearchResult(query);

  useEffect(() => {
    setQuery(keyword ? (keyword as string) : undefined);
  }, [keyword]);

  if (isLoading) {
    return (
      <SearchPageLayout>
        <Spinner />
      </SearchPageLayout>
    );
  }

  return (
    <SearchPageLayout>
      <SearchKeywordSection keyword={searchKeyword} result={data} />
      <Divider />
      <SearchResultGoodsSection data={data.goods} />
      <Divider />
      <SearchResultContentsSection />
      <Divider />
      <SearchResultBroadcasterSection />
    </SearchPageLayout>
  );
}

export default Search;
