import { Box } from '@chakra-ui/react';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { GlobalSearcher } from '@project-lc/components-web-kkshow/GlobalSearcher';
import { SearchPageSearcher } from '@project-lc/components-web-kkshow/SearchPageSearcher';

export function Search(): JSX.Element {
  return (
    <KkshowLayout>
      <SearchPageSearcher />
    </KkshowLayout>
  );
}

export default Search;
