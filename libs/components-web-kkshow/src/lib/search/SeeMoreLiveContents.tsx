import { Grid, GridItem } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import LiveContentCard from './LiveContentCard';
import { SearchResultEmptyText } from './SearchResultSectionContainer';
import SeeMorePageLayout, { useSeeMorePageState } from './SeeMorePageLayout';

export interface SeeMoreLiveContentsProps {
  data: SearchResultItem[];
}
export function SeeMoreLiveContents({ data }: SeeMoreLiveContentsProps): JSX.Element {
  const { dataToDisplay, handleLoadMore } = useSeeMorePageState({
    data,
    itemPerPage: 9,
  });

  return (
    <SeeMorePageLayout
      title="라이브 컨텐츠"
      resultCount={data.length}
      handleLoadMore={handleLoadMore}
    >
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={6}
        mb={8}
      >
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
