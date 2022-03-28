import { Box } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { GlobalSearcher } from '@project-lc/components-web-kkshow/GlobalSearcher';
import { SearchPageSearcher } from '@project-lc/components-web-kkshow/SearchPageSearcher';
import { useKkshowSearchResults } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function Search(): JSX.Element {
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

export default Search;
