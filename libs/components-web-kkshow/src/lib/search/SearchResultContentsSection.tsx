import { Box } from '@chakra-ui/react';

export interface SearchResultContentsSectionProps {
  propname?: any;
}
export function SearchResultContentsSection({
  propname,
}: SearchResultContentsSectionProps): JSX.Element {
  return <Box>검색결과 - 라이브 컨텐츠</Box>;
}

export default SearchResultContentsSection;
