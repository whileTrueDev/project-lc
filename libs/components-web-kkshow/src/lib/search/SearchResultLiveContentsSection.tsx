import { Box } from '@chakra-ui/react';

export interface SearchResultLiveContentsSectionProps {
  propname?: any;
}
export function SearchResultLiveContentsSection({
  propname,
}: SearchResultLiveContentsSectionProps): JSX.Element {
  return <Box>검색결과 - 라이브 컨텐츠</Box>;
}

export default SearchResultLiveContentsSection;
