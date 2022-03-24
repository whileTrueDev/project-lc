import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { BestBroadcasterItem } from '../main/KkshowMainBestBroadcaster';
import { SearchResultEmptyText } from './SearchResultSectionContainerLayout';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreBroadcastersProps {
  data: SearchResultItem[];
}
export function SeeMoreBroadcasters({ data }: SeeMoreBroadcastersProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 15,
  });
  const itemPerRow = {
    base: 2, // 모바일화면에서 한줄에 2개씩 표시
    md: 5, // md이상 화면에서 한줄에 5개씩 표시
  };
  const templateColumns = useBreakpointValue({
    base: `repeat(${itemPerRow.base}, 1fr)`,
    md: `repeat(${itemPerRow.md}, 1fr)`,
  });
  return (
    <SeeMorePageLayout
      title="방송인"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid templateColumns={templateColumns} gap={6} mb={8}>
        {dataToDisplay.length > 0 ? (
          dataToDisplay.map((item, index) => {
            const key = `${item.title}_${index}`;
            return (
              <GridItem w="100%" h="100%" key={key} py={8}>
                <BestBroadcasterItem
                  avatarUrl={item.imageUrl}
                  broadcasterName={item.title}
                  href={item.linkUrl}
                />
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

export default SeeMoreBroadcasters;
