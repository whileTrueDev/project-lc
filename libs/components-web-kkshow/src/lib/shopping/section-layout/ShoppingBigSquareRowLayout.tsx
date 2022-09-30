import {
  Box,
  GridItem,
  Heading,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import GoodsDisplay from '../../GoodsDisplay';
import KkshowMainTitle from '../../main/KkshowMainTitle';

export function ShoppingBigSquareRowLayout({
  title,
  data,
}: {
  title: string;
  description?: string;
  data: KkshowShoppingTabGoodsData[];
}): JSX.Element {
  return (
    <Box bgColor={useColorModeValue('gray.100', 'gray.900')} py={[10, 20]} px={2}>
      <Box maxW="5xl" mx="auto">
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
          <Swiper
            style={{ paddingTop: 16, paddingBottom: 24 }}
            spaceBetween={16}
            slidesPerView={useBreakpointValue({ base: 'auto', md: 3 })}
          >
            {data.map((item) => (
              <SwiperSlide key={item.name} style={{ width: '80%', maxWidth: 360 }}>
                <FadeUp isChild boxProps={{ as: GridItem }} key={item.name}>
                  <GoodsDisplay variant="card" goods={item} />
                </FadeUp>
              </SwiperSlide>
            ))}
          </Swiper>
        </FadeUp>
      </Box>
    </Box>
  );
}

export default ShoppingBigSquareRowLayout;
