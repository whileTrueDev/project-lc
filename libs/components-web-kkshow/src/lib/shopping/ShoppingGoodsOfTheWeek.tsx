import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import SlideCustom from '@project-lc/components-layout/motion/SlideCustom';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { useState } from 'react';
import { Autoplay, Swiper as _Swiper } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsDisplayDetail } from '../GoodsDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

export function ShoppingGoodsOfTheWeek(): JSX.Element {
  const items: Array<KkshowShoppingTabGoodsData> = [
    {
      imageUrl: 'images/test/thum-4.png',
      linkUrl: '#',
      discountedPrice: 333000,
      name: '길고길고길고길고길고길고긴 이름',
      normalPrice: 555000,
    },
    {
      imageUrl: 'images/test/thum-3.png',
      linkUrl: '#',
      discountedPrice: 333000,
      name: '길고길고길고길고길고길고긴길고길고길고길고길고길고긴 이름2',
      normalPrice: 555000,
    },
    {
      imageUrl: 'images/test/thum-2.png',
      linkUrl: '#',
      discountedPrice: 333000,
      name: '길고길고길고길고길고길고긴 이름3',
      normalPrice: 555000,
    },
    {
      imageUrl: 'images/test/thum-20.png',
      linkUrl: '#',
      discountedPrice: 43000,
      name: '닭강정1',
      normalPrice: 50000,
    },
    {
      imageUrl: 'images/test/thum-18.png',
      linkUrl: '#',
      discountedPrice: 3000,
      name: '미드운 닭불갈비',
      normalPrice: 5000,
    },
  ];
  const [active, setActive] = useState<KkshowShoppingTabGoodsData>(items[0]);
  const onSlideChange = (swiper: _Swiper): void => {
    setActive(items[swiper.activeIndex]);
  };

  const title = (
    <KkshowMainTitle
      centered={false}
      bulletPosition="top"
      bulletSize={[3, 4]}
      distance={5}
    >
      <Heading as="p" fontSize="2xl" color="blue.500">
        시선 집중!
      </Heading>
      <Heading as="p" fontSize="2xl" color="blue.500">
        금주의 상품
      </Heading>
    </KkshowMainTitle>
  );

  const detail = (
    <SlideCustom>
      <GoodsDisplayDetail goods={active} fontSize={['xl', 'xl', '2xl']} noOfLines={2} />
    </SlideCustom>
  );

  return (
    <Flex
      px={2}
      direction={['column', 'row']}
      mt={[12, 12, 24]}
      maxW="5xl"
      mx="auto"
      align="center"
      justify="space-between"
      position="relative"
    >
      <Flex
        flexDir="column"
        h={['unset', 300]}
        minH={['unset', 250]}
        w="100%"
        minW={200}
        maxW={300}
        gap={4}
        justify="space-evenly"
        align={['center', 'flex-start']}
      >
        {title}
        <Box display={['none', 'flex']}>{active ? detail : null}</Box>
      </Flex>

      <FadeUp>
        <Swiper
          style={{ paddingBottom: 16 }}
          slidesPerView="auto"
          grabCursor
          slideToClickedSlide
          centeredSlides
          autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
          modules={[Autoplay]}
          onSlideChange={onSlideChange}
        >
          {items.map((item) => (
            <SwiperSlide key={item.name} style={{ width: '70%', maxWidth: 340 }}>
              {({ isActive }) => (
                <Image
                  w="100%"
                  h="100%"
                  transform={isActive ? 'scale(1)' : 'scale(0.8)'}
                  src={item.imageUrl}
                  transition="all 0.3s"
                  rounded="3xl"
                  boxShadow="xl"
                  draggable={false}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </FadeUp>

      <Flex
        overflow="hidden"
        textAlign="center"
        display={['flex', 'none']}
        px={6}
        minH={100}
      >
        {active ? detail : null}
      </Flex>
    </Flex>
  );
}

export default ShoppingGoodsOfTheWeek;
