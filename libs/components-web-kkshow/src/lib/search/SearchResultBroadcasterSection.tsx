import { Box } from '@chakra-ui/react';

export interface SearchResultBroadcasterSectionProps {
  propname?: any;
}
export function SearchResultBroadcasterSection({
  propname,
}: SearchResultBroadcasterSectionProps): JSX.Element {
  return <Box>검색결과 - 방송인</Box>;
}

export default SearchResultBroadcasterSection;
