import { Box, Grid, GridItem, Heading, useColorModeValue } from '@chakra-ui/react';
import GoodsDisplay from '@project-lc/components-web-kkshow/GoodsDisplay';
import KkshowMainTitle from '@project-lc/components-web-kkshow/main/KkshowMainTitle';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';

export function MarketRecommendations(): JSX.Element {
  const items: Array<KkshowShoppingTabGoodsData> = [
    {
      imageUrl: 'images/test/thum-14.png',
      linkUrl: '#',
      discountedPrice: 9900,
      name: '식스레시피 감자전',
      normalPrice: 12300,
    },
    {
      imageUrl: 'images/test/thum-15.png',
      linkUrl: '#',
      discountedPrice: 12900,
      name: '내조국국밥 모듬국밥',
      normalPrice: 19900,
    },
    {
      imageUrl: 'images/test/thum-16.png',
      linkUrl: '#',
      discountedPrice: 8900,
      name: '삼형제고기 양념쭈꾸미',
      normalPrice: 10900,
    },
  ];
  return (
    <Box bgColor={useColorModeValue('gray.100', 'gray.900')} py={20}>
      <Box maxW="5xl" mx="auto">
        <KkshowMainTitle
          centered={false}
          distance={8}
          bulletSize={6}
          bulletPosition="left"
          bulletVariant="outline"
          color="blue.500"
        >
          <Heading color="blue.500" fontSize="2xl">
            크크마켓 추천상품
          </Heading>
        </KkshowMainTitle>

        <Grid gridTemplateColumns="1fr 1fr 1fr" gap={4}>
          {items.map((item) => {
            return (
              <GridItem key={item.name}>
                <GoodsDisplay variant="card" goods={item} />
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default MarketRecommendations;
