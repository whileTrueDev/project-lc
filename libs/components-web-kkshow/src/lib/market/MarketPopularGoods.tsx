import { Box, Flex, Grid, GridItem, Heading, Image } from '@chakra-ui/react';
import GoodsDisplay from '@project-lc/components-web-kkshow/GoodsDisplay';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { memo } from 'react';

export function MarketPopularGoods(): JSX.Element {
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

  const PopularGoodsTitle = memo(
    (): JSX.Element => (
      <GridItem
        textAlign="center"
        as={Flex}
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Image src="images/test/awn.png" />
        <Heading color="blue.500" fontSize="3xl" whiteSpace="break-spaces">
          {`다른 고객님들이\n많이 찾은 상품`}
        </Heading>
        <Image src="images/test/food-ic.png" />
      </GridItem>
    ),
  );
  return (
    <Box maxW="5xl" mx="auto" py={20}>
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap={4}>
        {items.map((item, idx) => {
          const component = (
            <GridItem key={item.name}>
              <GoodsDisplay variant="middle" goods={item} />
            </GridItem>
          );
          if (idx === 1)
            return (
              <>
                <PopularGoodsTitle />
                {component}
              </>
            );
          return component;
        })}
      </Grid>
    </Box>
  );
}

export default MarketPopularGoods;
