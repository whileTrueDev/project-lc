import { Box, GridItem, Heading, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { FadeUp } from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { useMemo } from 'react';
import GoodsDisplay from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

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

export function ShoppingNewLineUp(): JSX.Element {
  const howMuchItemsToShow = useBreakpointValue({ base: 4, sm: 3, md: 4, lg: 5 });
  const displayingItems = useMemo(
    () => items.slice(0, howMuchItemsToShow),
    [howMuchItemsToShow],
  );
  return (
    <Box maxW="5xl" mx="auto" py={[10, 20]} px={2}>
      <KkshowMainTitle
        centered={false}
        distance={8}
        bulletSize={6}
        bulletPosition="left"
        bulletVariant="outline"
        color="blue.500"
      >
        <Heading as="p" color="blue.500" fontSize="2xl">
          놓치면 아쉬운 신상 라인업
        </Heading>
      </KkshowMainTitle>

      <FadeUp>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={{ base: 2, sm: 4 }}>
          {displayingItems.map((item) => (
            <FadeUp key={item.name} isChild boxProps={{ as: GridItem }}>
              <GoodsDisplay goods={item} />
            </FadeUp>
          ))}
        </SimpleGrid>
      </FadeUp>
    </Box>
  );
}

export default ShoppingNewLineUp;
