import { Box } from '@chakra-ui/react';

export interface SearchResultGoodsSectionProps {
  propname?: any;
}
export function SearchResultGoodsSection({
  propname,
}: SearchResultGoodsSectionProps): JSX.Element {
  return <Box>검색결과 - 상품</Box>;
}

export default SearchResultGoodsSection;
