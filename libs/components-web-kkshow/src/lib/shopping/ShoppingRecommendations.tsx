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
import GoodsDisplay from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

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

export function ShoppingRecommendations(): JSX.Element {
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
          <Heading as="p" color="blue.500" fontSize="2xl">
            크크마켓 추천상품
          </Heading>
        </KkshowMainTitle>

        <FadeUp>
          <Swiper
            style={{ paddingTop: 24, paddingBottom: 24 }}
            spaceBetween={16}
            slidesPerView={useBreakpointValue({ base: 'auto', md: 3 })}
          >
            {items.map((item) => (
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
