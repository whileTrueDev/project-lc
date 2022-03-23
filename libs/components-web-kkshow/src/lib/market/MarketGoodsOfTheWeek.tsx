import { Fade, Flex, Heading, Image } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import KkshowMainTitle from '@project-lc/components-web-kkshow/main/KkshowMainTitle';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { useState } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export function MarketGoodsOfTheWeek(): JSX.Element {
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
      name: '길고길고길고길고길고길고긴 이름2',
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

  return (
    <Flex
      mt={24}
      maxW="5xl"
      mx="auto"
      align="center"
      justify="space-between"
      position="relative"
    >
      <Fade in={!!active} unmountOnExit>
        {active && (
          <Flex
            zIndex={5}
            flexDir="column"
            w={300}
            h={300}
            minW={250}
            minH={250}
            p={4}
            gap={4}
            justify="space-evenly"
          >
            <KkshowMainTitle
              centered={false}
              bulletPosition="top"
              bulletSize={4}
              distance={6}
            >
              <Heading fontSize="2xl" color="blue.500">
                시선 집중!
              </Heading>
              <Heading fontSize="2xl" color="blue.500">
                금주의 상품
              </Heading>
            </KkshowMainTitle>
            <MotionBox initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Heading fontSize="2xl" fontWeight="medium" mb={4}>
                {active.name}
              </Heading>
              <Heading fontSize="md" textDecor="line-through" color="gray.500">
                {active.normalPrice.toLocaleString()}
              </Heading>
              <Heading fontSize="3xl">
                <Heading fontSize="xl" as="span" color="red">
                  {(
                    ((active.normalPrice - active.discountedPrice) / active.normalPrice) *
                    100
                  ).toFixed(0)}
                  %
                </Heading>{' '}
                {active.discountedPrice.toLocaleString()}원
              </Heading>
            </MotionBox>
          </Flex>
        )}
      </Fade>

      <Swiper
        style={{ paddingBottom: 32 }}
        slidesPerView="auto"
        grabCursor
        slideToClickedSlide
        centeredSlides
        autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
        modules={[Autoplay]}
        slidesPerGroup={1}
        onSlideChange={(swiper) => {
          setActive(items[swiper.activeIndex]);
        }}
      >
        {items.map((item) => (
          <SwiperSlide
            key={item.name}
            style={{
              width: 400,
              verticalAlign: 'middle',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {({ isActive }) => (
              <Image
                w="100%"
                h="100%"
                transform={isActive ? 'scale(1)' : 'scale(0.8)'}
                src={item.imageUrl}
                transition="all 0.3s"
                rounded="3xl"
                boxShadow="xl"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
}
