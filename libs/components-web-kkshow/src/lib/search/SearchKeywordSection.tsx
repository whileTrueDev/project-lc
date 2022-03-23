import { Box } from '@chakra-ui/react';
import GlobalSearcher from '../GlobalSearcher';

export interface SearchKeywordSectionProps {
  keyword?: string;
}
export function SearchKeywordSection({
  keyword,
}: SearchKeywordSectionProps): JSX.Element {
  if (!keyword) {
    return (
      <Box>
        검색어를 입력하세요!!
        <GlobalSearcher />
      </Box>
    );
  }
  return <Box>검색어 : {keyword}</Box>;
}

export default SearchKeywordSection;
