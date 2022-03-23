import { Box, GridItem, Heading, SimpleGrid } from '@chakra-ui/react';
import KkshowMainTitle from '@project-lc/components-web-kkshow/main/KkshowMainTitle';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import GoodsDisplay from '../GoodsDisplay';

export function MarketNewLineUp(): JSX.Element {
  const items: Array<KkshowShoppingTabGoodsData> = [
    {
      imageUrl: 'images/test/thum-4.png',
      linkUrl: '#',
      discountedPrice: 9000,
      name: '텐카이치멘 돈코츠라멘',
      normalPrice: 12300,
    },
    {
      imageUrl: 'images/test/thum-5.png',
      linkUrl: '#',
      discountedPrice: 12900,
      name: '예스닭강정 순한맛',
      normalPrice: 19900,
    },
    {
      imageUrl: 'images/test/thum-6.png',
      linkUrl: '#',
      discountedPrice: 8900,
      name: '삼형제고기 양념쭈꾸미',
      normalPrice: 10900,
    },
    {
      imageUrl: 'images/test/thum-7.png',
      linkUrl: '#',
      discountedPrice: 14900,
      name: '진국보감 갈비전골',
      normalPrice: 16900,
    },
    {
      imageUrl: 'images/test/thum-8.png',
      linkUrl: '#',
      discountedPrice: 5400,
      name: '미드운 닭불고기',
      normalPrice: 6000,
    },
  ];
  return (
    <Box maxW="5xl" mx="auto" py={20}>
      <KkshowMainTitle
        centered={false}
        distance={8}
        bulletSize={6}
        bulletPosition="left"
        bulletVariant="outline"
        color="blue.500"
      >
        <Heading color="blue.500" fontSize="2xl">
          놓치면 아쉬운 신상 라인업
        </Heading>
      </KkshowMainTitle>

      <SimpleGrid columns={5} gap={4}>
        {items.map((item) => (
          <GridItem key={item.name}>
            <GoodsDisplay goods={item} />
          </GridItem>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default MarketNewLineUp;
