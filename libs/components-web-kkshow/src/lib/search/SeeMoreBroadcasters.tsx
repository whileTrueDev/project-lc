import { Grid, GridItem } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { BestBroadcasterItem } from '../main/KkshowMainBestBroadcaster';
import { SearchResultEmptyText } from './SearchResultSectionContainer';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreBroadcastersProps {
  data: SearchResultItem[];
}
export function SeeMoreBroadcasters({ data }: SeeMoreBroadcastersProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 15,
  });
  return (
    <SeeMorePageLayout
      title="방송인"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
        gap={6}
        mb={8}
      >
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
