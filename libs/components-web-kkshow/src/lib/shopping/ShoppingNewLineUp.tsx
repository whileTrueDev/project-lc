import { Box, GridItem, Heading, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { FadeUp } from '@project-lc/components-layout/motion/FadeUp';
import { useKkshowShopping } from '@project-lc/hooks';
import { useMemo } from 'react';
import GoodsDisplay from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

export function ShoppingNewLineUp(): JSX.Element {
  const { data } = useKkshowShopping();
  const howMuchItemsToShow = useBreakpointValue({ base: 4, sm: 3, md: 4, lg: 5 });
  const displayingItems = useMemo(
    () => data?.newLineUp.slice(0, howMuchItemsToShow),
    [data?.newLineUp, howMuchItemsToShow],
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

export default ShoppingNewLineUp;
