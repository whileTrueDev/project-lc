import { Spinner } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SeeMoreBroadcasters from '@project-lc/components-web-kkshow/search/SeeMoreBroadcasters';

export function Broadcaster(): JSX.Element {
  const { data, isLoading, searchKeyword } = useSearchPageState();
  const resultCount = data ? data.broadcasters.length : 0;

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
      <SeeMoreBroadcasters data={data.broadcasters} />
    </SearchPageLayout>
  );
}

export default Broadcaster;
