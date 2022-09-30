import { Box, Flex, Heading, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import SlideCustom from '@project-lc/components-layout/motion/SlideCustom';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import Link from 'next/link';
import { useState } from 'react';
import { Autoplay, Swiper as _Swiper } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsDisplayDetail } from '../../GoodsDisplay';
import KkshowMainTitle from '../../main/KkshowMainTitle';

export function ShoppingAutoSlideLayout({
  title,
  data,
}: {
  title: string;
  data: KkshowShoppingTabGoodsData[];
}): JSX.Element {
  const [active, setActive] = useState<KkshowShoppingTabGoodsData | undefined>();
  const onSlideChange = (swiper: _Swiper): void => {
    setActive(data[swiper.activeIndex]);
  };

  const titleComponent = (
    <KkshowMainTitle
      centered={false}
      bulletPosition="top"
      bulletSize={[3, 4]}
      distance={5}
    >
      <Heading
        as="p"
        fontSize={['xl', '2xl']}
        color="blue.500"
        whiteSpace="break-spaces"
        wordBreak="keep-all"
      >
        {title}
      </Heading>
    </KkshowMainTitle>
  );

  const detail = active ? (
    <SlideCustom>
      <LinkBox>
        <Link href={active.linkUrl} passHref>
          <LinkOverlay href={active.linkUrl}>
            <GoodsDisplayDetail
              goods={active}
              fontSize={['md', 'lg', '2xl']}
              noOfLines={2}
            />
          </LinkOverlay>
        </Link>
      </LinkBox>
    </SlideCustom>
  ) : null;

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
        {titleComponent}
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
          onImagesReady={onSlideChange}
        >
          {data.map((item) => (
            <SwiperSlide key={item.name} style={{ width: '75%', maxWidth: 340 }}>
              {({ isActive }) => (
                <ChakraNextImage
                  layout="intrinsic"
                  objectFit="cover"
                  height={340}
                  width={340}
                  src={item.imageUrl}
                  alt={item.name}
                  transform={isActive ? 'scale(1)' : 'scale(0.8)'}
                  transition="all 0.3s"
                  borderRadius="2xl"
                  boxShadow="lg"
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
