import { Spinner } from '@chakra-ui/react';
import SearchPageLayout from '@project-lc/components-web-kkshow/search/SearchPageLayout';
import { useKkshowSearchResult } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SeeMoreGoods from '@project-lc/components-web-kkshow/search/SeeMoreGoods';
import SearchKeywordSection from '@project-lc/components-web-kkshow/search/SearchKeywordSection';

export function Goods(): JSX.Element {
  const router = useRouter();
  const { keyword } = router.query;

  const searchKeyword = keyword ? (keyword as string) : undefined;

  const [query, setQuery] = useState<string | undefined>(searchKeyword);

  const { data, isLoading } = useKkshowSearchResult(query);

  useEffect(() => {
    setQuery(keyword ? (keyword as string) : undefined);
  }, [keyword]);

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
      <SeeMoreGoods data={data.goods} />
    </SearchPageLayout>
  );
}

export default Goods;
