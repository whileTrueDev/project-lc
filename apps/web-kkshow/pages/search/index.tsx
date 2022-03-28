import { Box, Divider, Spinner } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { GlobalSearcher } from '@project-lc/components-web-kkshow/GlobalSearcher';
import { SearchPageSearcher } from '@project-lc/components-web-kkshow/SearchPageSearcher';
import { useKkshowSearchResults } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SearchResultBroadcasterSection from '@project-lc/components-web-kkshow/search/SearchResultBroadcasterSection';
import SearchResultGoodsSection from '@project-lc/components-web-kkshow/search/SearchResultGoodsSection';
import SearchResultLiveContentsSection from '@project-lc/components-web-kkshow/search/SearchResultLiveContentsSection';

export function Search1(): JSX.Element {
  const router = useRouter();
  const keyword = router.query.keyword as string;
  console.log('키워드', keyword);
  const { data } = useKkshowSearchResults(keyword);
  console.log(data);
  return (
    <KkshowLayout>
      <SearchPageSearcher />
    </KkshowLayout>
  );
}
export function Search2(): JSX.Element {
  const { data, isLoading, searchKeyword } = useSearchPageState();
  const resultCount = data
    ? data.broadcasters.length + data.goods.length + data.liveContents.length
    : 0;

  if (isLoading) {
    return (
      <SearchPageLayout>
        <Spinner />
      </SearchPageLayout>
    );
  }

  return (
    <SearchPageLayout>
      <SearchKeywordSection keyword={searchKeyword} resultCount={resultCount} />
      <Divider />
      <SearchResultGoodsSection keyword={searchKeyword} data={data.goods} />
      <Divider />
      <SearchResultLiveContentsSection keyword={searchKeyword} data={data.liveContents} />
      <Divider />
      <SearchResultBroadcasterSection keyword={searchKeyword} data={data.broadcasters} />
    </SearchPageLayout>
  );
}

export default Search1;
