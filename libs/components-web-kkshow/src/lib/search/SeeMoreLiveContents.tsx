import { Button, Grid, GridItem, Stack, Center } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LiveContentCard from './LiveContentCard';
import { SearchResultSectionContainer } from './SearchResultSectionContainer';

export interface SeeMoreLiveContentsProps {
  data: SearchResultItem[];
}
export function SeeMoreLiveContents({ data }: SeeMoreLiveContentsProps): JSX.Element {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  // 한 페이지에 몇개의 아이템 표시할것인지
  const itemPerPage = 9;
  const displayLoadMoreButton = data.length > page * itemPerPage;
  const dataToDisplay = data.slice(0, page * itemPerPage);
  return (
    <SearchResultSectionContainer
      title="라이브 컨텐츠"
      resultCount={data.length}
      actionButton={
        <Button variant="link" onClick={() => router.back()}>
          돌아가기
        </Button>
      }
    >
      <Stack>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={6}
          mb={8}
        >
          {dataToDisplay.map((item, index) => {
            const key = `${item.title}_${index}`;
            return (
              <GridItem w="100%" h="100%" key={key}>
                <LiveContentCard item={item} />
              </GridItem>
            );
          })}
        </Grid>
        {displayLoadMoreButton && (
          <Center>
            <Button onClick={() => setPage((prev) => prev + 1)}>더보기</Button>
          </Center>
        )}
      </Stack>
    </SearchResultSectionContainer>
  );
}

export default SeeMoreLiveContents;
