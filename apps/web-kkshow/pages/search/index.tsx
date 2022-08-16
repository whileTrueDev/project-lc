import { Box, Divider, Spinner } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SearchResultBroadcasterSection from '@project-lc/components-web-kkshow/search/SearchResultBroadcasterSection';
import SearchResultGoodsSection from '@project-lc/components-web-kkshow/search/SearchResultGoodsSection';
import SearchResultLiveContentsSection from '@project-lc/components-web-kkshow/search/SearchResultLiveContentsSection';

export function Search(): JSX.Element {
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
      {!data && ( // /search 페이지
        <Box>
          <SearchKeywordSection keyword="" resultCount={0} />
        </Box>
      )}
      {data && (
        <>
          <SearchKeywordSection keyword={searchKeyword} resultCount={resultCount} />
          <Divider />
          <SearchResultGoodsSection keyword={searchKeyword} data={data.goods} />
          <Divider />
          <SearchResultBroadcasterSection
            keyword={searchKeyword}
            data={data.broadcasters}
          />
          <Divider />
          <SearchResultLiveContentsSection
            keyword={searchKeyword}
            data={data.liveContents}
          />
        </>
      )}
    </SearchPageLayout>
  );
}

export default Search;
