import { Box, Flex, ScaleFade, SlideFade, useBreakpointValue } from '@chakra-ui/react';
import { ChevronIconButton } from '@project-lc/components-core/HorizontalImageGallery';
import { WaveBox } from '@project-lc/components-core/WaveBox';
import { useMainDataTest } from '@project-lc/hooks';
import { KkshowMainCarousel as TKkshowMainCarousel } from '@project-lc/shared-types';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import KkshowMainCarouselContents from './carousel/KkshowMainCarouselContents';
import { KkshowMainCarouselDescription } from './carousel/KkshowMainCarouselDescription';
import KkshowMainCarouselHeader from './carousel/KkshowMainCarouselHeader';

export function KkshowMainCarousel(): JSX.Element {
  return (
    <WaveBox position="relative" bgColor="blue.500">
      <Flex h={{ base: 530, md: 700 }}>
        <MainCarousel />
      </Flex>
    </WaveBox>
  );
}

function MainCarousel(): JSX.Element | null {
  const { data } = useMainDataTest();
  const slidesPerView = useBreakpointValue<'auto' | number>({ base: 1, md: 'auto' });
  if (!data) return null;

  return (
    <Swiper
      updateOnWindowResize
      spaceBetween={120}
      slidesPerView={slidesPerView}
      centeredSlides
      loop
      grabCursor
      loopedSlides={data.carousel.length}
      pagination={{ clickable: true }}
      modules={[Pagination, Autoplay, Navigation]}
      style={{ height: '100%' }}
      autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
    >
      {data &&
        data.carousel.map((item) => (
          <SwiperSlide
            style={{ minWidth: 320, width: 720, margin: '0 auto' }}
            key={item.imageUrl}
          >
            {(slideProps) => {
              return (
                <MainCarouselItem
                  key={item.imageUrl}
                  item={item}
                  isActive={slideProps.isActive}
                />
              );
            }}
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

interface MainCarouselItemProps {
  item: TKkshowMainCarousel;
  isActive: boolean;
}
function MainCarouselItem({ item, isActive }: MainCarouselItemProps): JSX.Element {
  const swiper = useSwiper();

  return (
    <Flex
      h="100%"
      mx={{ base: 2, md: 4 }}
      gap={4}
      flexDir="column"
      justify={{ base: 'flex-start', md: 'center' }}
      position="relative"
    >
      <ScaleFade in={isActive} transition={{ enter: { duration: 0.5 } }}>
        <KkshowMainCarouselHeader type={item.type} />
      </ScaleFade>

      <Box
        borderRadius="xl"
        bgColor="white"
        h={{ base: 300, md: 400 }}
        p={1}
        filter={isActive ? 'none' : 'brightness(50%)'}
        boxShadow={isActive ? '2x' : 'none'}
        transitionDuration="0.5s"
      >
        <KkshowMainCarouselContents item={item} />
      </Box>

      <SlideFade
        in={isActive}
        transition={{ enter: { duration: 0.5 }, exit: { duration: 0 } }}
        offsetY={-14}
      >
        <KkshowMainCarouselDescription item={item} />
      </SlideFade>

      {isActive && (
        <Box display={{ base: 'none', md: 'contents' }}>
          <ChevronIconButton
            variant="outlined"
            direction="left"
            left={{ md: -55, xl: -100 }}
            bottom="50%"
            onClick={() => swiper.slidePrev()}
          />

          <ChevronIconButton
            variant="outlined"
            direction="right"
            right={{ md: -55, xl: -100 }}
            bottom="50%"
            onClick={() => swiper.slideNext()}
          />
        </Box>
      )}
    </Flex>
  );
}
export default KkshowMainCarousel;
