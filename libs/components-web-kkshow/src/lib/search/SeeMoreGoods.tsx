import { Button, Grid, GridItem } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { GoodsCard } from './GoodsCard';
import { SearchResultSectionContainer } from './SearchResultSectionContainer';

export interface SeeMoreGoodsProps {
  data: SearchResultItem[];
}
export function SeeMoreGoods({ data }: SeeMoreGoodsProps): JSX.Element {
  const router = useRouter();
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
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
        {data.map((item, index) => {
          const key = `${item.title}_${index}`;
          return (
            <GridItem w="100%" h="100%" key={key}>
              <GoodsCard item={item} />
            </GridItem>
          );
        })}
      </Grid>
    </SearchResultSectionContainer>
  );
}

export default SeeMoreGoods;
