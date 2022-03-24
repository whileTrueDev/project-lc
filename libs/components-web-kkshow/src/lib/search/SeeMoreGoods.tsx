import { Button, Grid, GridItem, Stack, Center } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GoodsCard } from './GoodsCard';
import { SearchResultSectionContainer } from './SearchResultSectionContainer';

export interface SeeMoreGoodsProps {
  data: SearchResultItem[];
}
export function SeeMoreGoods({ data }: SeeMoreGoodsProps): JSX.Element {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const itemPerPage = 12;
  const displayLoadMoreButton = data.length > page * itemPerPage;
  const dataToDisplay = data.slice(0, page * itemPerPage);
  return (
    <SearchResultSectionContainer
      title="상품"
      resultCount={data.length}
      actionButton={
        <Button variant="link" onClick={() => router.back()}>
          돌아가기
        </Button>
      }
    >
      <Stack>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gap={6}
          mb={8}
        >
          {dataToDisplay.map((item, index) => {
            const key = `${item.title}_${index}`;
            return (
              <GridItem w="100%" h="100%" key={key}>
                <GoodsCard item={item} />
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

export default SeeMoreGoods;
