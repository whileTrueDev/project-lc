import { Grid, GridItem } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { GoodsCard } from './GoodsCard';
import { SearchResultEmptyText } from './SearchResultSectionContainer';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreGoodsProps {
  data: SearchResultItem[];
}
export function SeeMoreGoods({ data }: SeeMoreGoodsProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 12,
  });
  return (
    <SeeMorePageLayout
      title="상품"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={6}
        mb={8}
      >
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((item, index) => {
            const key = `${item.title}_${index}`;
            return (
              <GridItem w="100%" h="100%" key={key}>
                <GoodsCard item={item} />
              </GridItem>
            );
          })
        ) : (
          <SearchResultEmptyText />
        )}
      </Grid>
    </SeeMorePageLayout>
  );
}

export default SeeMoreGoods;
