import { Spinner } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SeeMoreLiveContents from '@project-lc/components-web-kkshow/search/SeeMoreLiveContents';

export function LiveContents(): JSX.Element {
  const { data, isLoading, searchKeyword } = useSearchPageState();
  const resultCount = data ? data.liveContents.length : 0;

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
      <SeeMoreLiveContents data={data.liveContents || []} />
    </SearchPageLayout>
  );
}

export default LiveContents;
