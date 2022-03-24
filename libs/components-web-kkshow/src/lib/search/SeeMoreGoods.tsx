import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { GoodsCard } from './GoodsCard';
import { SearchResultEmptyText } from './SearchResultSectionContainerLayout';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreGoodsProps {
  data: SearchResultItem[];
}
export function SeeMoreGoods({ data }: SeeMoreGoodsProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 12,
  });
  const itemPerRow = {
    base: 2, // 모바일화면에서 한줄에 2개씩 표시
    md: 4, // md이상 화면에서 한줄에 4개씩 표시
  };
  const templateColumns = useBreakpointValue({
    base: `repeat(${itemPerRow.base}, 1fr)`,
    md: `repeat(${itemPerRow.md}, 1fr)`,
  });
  return (
    <SeeMorePageLayout
      title="상품"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid templateColumns={templateColumns} gap={6} mb={8}>
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
