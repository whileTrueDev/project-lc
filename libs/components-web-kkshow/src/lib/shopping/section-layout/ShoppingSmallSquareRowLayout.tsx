import { Box, GridItem, Heading, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { FadeUp } from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { useMemo } from 'react';
import { GoodsDisplay } from '../../GoodsDisplay';
import KkshowMainTitle from '../../main/KkshowMainTitle';

export function ShoppingSmallSquareRowLayout({
  title,
  data,
}: {
  title: string;
  data: KkshowShoppingTabGoodsData[];
}): JSX.Element {
  const howMuchItemsToShow = useBreakpointValue({ base: 4, sm: 3, md: 4, lg: 5 });
  const displayingItems = useMemo(
    () => data.slice(0, howMuchItemsToShow),
    [data, howMuchItemsToShow],
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
        <Heading as="p" color="blue.500" fontSize={['xl', '2xl']}>
          {title}
        </Heading>
      </KkshowMainTitle>

      <FadeUp>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={{ base: 2, sm: 4 }}>
          {displayingItems?.map((item) => (
            <FadeUp key={item.name} isChild boxProps={{ as: GridItem }}>
              <GoodsDisplay goods={item} />
            </FadeUp>
          ))}
        </SimpleGrid>
      </FadeUp>
    </Box>
  );
}

export default ShoppingSmallSquareRowLayout;
