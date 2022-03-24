import { Box } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { SearchResultSectionContainer } from './SearchResultSectionContainer';

export interface SeeMoreGoodsProps {
  data: SearchResultItem[];
}
export function SeeMoreGoods({ data }: SeeMoreGoodsProps): JSX.Element {
  return (
    <SearchResultSectionContainer title="상품" resultCount={data.length}>
      {data.map((d, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={`${d.title}_${index}`}>{JSON.stringify(d)}</Box>
      ))}
    </SearchResultSectionContainer>
  );
}

export default SeeMoreGoods;
