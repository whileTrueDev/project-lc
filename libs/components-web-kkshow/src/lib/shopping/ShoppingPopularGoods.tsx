/* eslint-disable react/no-array-index-key */
import {
  Box,
  Flex,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { Fragment, memo, useMemo } from 'react';
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
    name: '예스닭강정 순한맛2',
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

export function ShoppingPopularGoods(): JSX.Element {
  const howMuchItemsToShow = useBreakpointValue({ base: 4, md: 5 });
  const displayingItems = useMemo(
    () => items.slice(0, howMuchItemsToShow),
    [howMuchItemsToShow],
  );
  const PopularGoodsTitle = memo(
    (): JSX.Element => (
      <GridItem
        textAlign="center"
        as={Flex}
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        gap={3}
      >
        <Image src="images/shopping/awn.png" />
        <Heading
          color="blue.500"
          fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
          whiteSpace="break-spaces"
        >
          {`다른 고객님들이\n많이 찾은 상품`}
        </Heading>
        <Image src="images/shopping/food-ic.png" />
      </GridItem>
    ),
  );

  const componentVariant = useBreakpointValue<'small' | 'middle'>({
    base: 'small',
    sm: 'middle',
  });
  const title = useBreakpointValue({
    base: '많이 찾은 상품',
    sm: '다른 고객님들이 많이 찾은 상품',
  });

  return (
    <FadeUp boxProps={{ maxW: '5xl', mx: 'auto', py: [10, 20], px: 2 }}>
      <Box display={{ base: 'block', md: 'none' }}>
        <KkshowMainTitle
          centered={false}
          bulletVariant={useBreakpointValue({ base: 'none', md: 'fill' })}
        >
          <Heading as="p" color="blue.500" fontSize="2xl">
            {title}
          </Heading>
        </KkshowMainTitle>
      </Box>

      <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
        {displayingItems.map((item, idx) => {
          const component = (
            <FadeUp key={item.name} isChild boxProps={{ as: GridItem }}>
              <GoodsDisplay variant={componentVariant} goods={item} />
            </FadeUp>
          );
          if (idx === 1) {
            return (
              <Fragment key={item.name}>
                <FadeUp
                  isChild
                  boxProps={{ as: GridItem, display: { base: 'none', md: 'block' } }}
                >
                  <PopularGoodsTitle />
                </FadeUp>
                {component}
              </Fragment>
            );
          }
          return component;
        })}
      </SimpleGrid>
    </FadeUp>
  );
}

export default ShoppingPopularGoods;
