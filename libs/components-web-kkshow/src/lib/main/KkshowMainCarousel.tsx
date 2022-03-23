import { Box, Flex, ScaleFade, SlideFade, useBreakpointValue } from '@chakra-ui/react';
import { WaveBox } from '@project-lc/components-core/WaveBox';
import { useKkshowMain } from '@project-lc/hooks';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import SwiperSlideItem from '../SwiperSlideItem';
import KkshowMainCarouselContents from './carousel/KkshowMainCarouselContents';
import { KkshowMainCarouselDescription } from './carousel/KkshowMainCarouselDescription';
import KkshowMainCarouselHeader from './carousel/KkshowMainCarouselHeader';

export function KkshowMainCarousel(): JSX.Element {
  return (
    <WaveBox position="relative" bgColor="blue.500">
      <Flex h={{ base: 530, md: 650 }}>
        <MainCarousel />
      </Flex>
    </WaveBox>
  );
}

function MainCarousel(): JSX.Element | null {
  const { data } = useKkshowMain();
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
        data.carousel.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <SwiperSlide style={{ minWidth: 320, width: 720, margin: '0 auto' }} key={idx}>
            {(slideProps) => {
              return <MainCarouselItem item={item} isActive={slideProps.isActive} />;
            }}
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

interface MainCarouselItemProps {
  item: KkshowMainCarouselItem;
  isActive: boolean;
}
function MainCarouselItem({ item, isActive }: MainCarouselItemProps): JSX.Element {
  const swiper = useSwiper();
  const onSlidePrev = (): void => swiper.slidePrev();
  const onSlideNext = (): void => swiper.slideNext();

  return (
    <SwiperSlideItem
      isActive={isActive}
      onSlideNext={onSlideNext}
      onSlidePrev={onSlidePrev}
    >
      <ScaleFade in={isActive} transition={{ enter: { duration: 0.5 } }}>
        <KkshowMainCarouselHeader type={item.type} />
      </ScaleFade>

      <Box
        borderRadius="xl"
        h={{ base: 300, md: 400 }}
        p={1}
        bgColor="white"
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
    </SwiperSlideItem>
  );
}
export default KkshowMainCarousel;
