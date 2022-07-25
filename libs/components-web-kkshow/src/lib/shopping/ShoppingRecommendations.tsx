import {
  Box,
  GridItem,
  Heading,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { useKkshowShopping } from '@project-lc/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import GoodsDisplay from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

export function ShoppingRecommendations(): JSX.Element {
  const { data } = useKkshowShopping();
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
            크크마켓 추천상품
          </Heading>
        </KkshowMainTitle>

        <FadeUp>
          <Swiper
            style={{ paddingTop: 16, paddingBottom: 24 }}
            spaceBetween={16}
            slidesPerView={useBreakpointValue({ base: 'auto', md: 3 })}
          >
            {data?.recommendations.map((item) => (
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

export default ShoppingRecommendations;
