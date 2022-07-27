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
import { useKkshowShopping } from '@project-lc/hooks';
import { Fragment, memo, useMemo } from 'react';
import GoodsDisplay from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

export function ShoppingPopularGoods(): JSX.Element {
  const { data } = useKkshowShopping();
  const howMuchItemsToShow = useBreakpointValue({ base: 4, md: 5 });
  const displayingItems = useMemo(
    () => data?.popularGoods.slice(0, howMuchItemsToShow),
    [data?.popularGoods, howMuchItemsToShow],
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
          <Heading as="p" color="blue.500" fontSize={['xl', '2xl']}>
            {title}
          </Heading>
        </KkshowMainTitle>
      </Box>

      <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
        {displayingItems?.map((item, idx) => {
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
