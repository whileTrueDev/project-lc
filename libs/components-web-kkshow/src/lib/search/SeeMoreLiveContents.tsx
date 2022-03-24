import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import LiveContentCard from './LiveContentCard';
import { SearchResultEmptyText } from './SearchResultSectionContainerLayout';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreLiveContentsProps {
  data: SearchResultItem[];
}
export function SeeMoreLiveContents({ data }: SeeMoreLiveContentsProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 9,
  });

  const itemPerRow = {
    base: 1, // 모바일화면에서 한줄에 1개씩 표시
    md: 3, // md이상 화면에서 한줄에 3개씩 표시
  };
  const templateColumns = useBreakpointValue({
    base: `repeat(${itemPerRow.base}, 1fr)`,
    md: `repeat(${itemPerRow.md}, 1fr)`,
  });

  return (
    <SeeMorePageLayout
      title="라이브 컨텐츠"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid templateColumns={templateColumns} gap={6} mb={8}>
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((item, index) => {
            const key = `${item.title}_${index}`;
            return (
              <GridItem w="100%" h="100%" key={key}>
                <LiveContentCard item={item} />
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

export default SeeMoreLiveContents;
