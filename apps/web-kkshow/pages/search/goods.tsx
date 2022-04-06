import { Spinner } from '@chakra-ui/react';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';
import SearchPageLayout, {
  useSearchPageState,
} from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import SeeMoreGoods from '@project-lc/components-web-kkshow/search/SeeMoreGoods';

export function Goods(): JSX.Element {
  const { data, isLoading, searchKeyword } = useSearchPageState();
  const resultCount = data ? data.goods.length : 0;

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
      <SeeMoreGoods data={data.goods || []} />
    </SearchPageLayout>
  );
}

export default Goods;
