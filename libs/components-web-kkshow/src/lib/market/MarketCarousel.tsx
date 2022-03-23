import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import SwiperSlideItem from '../SwiperSlideItem';

export function MarketCarousel(): JSX.Element {
  const slidesPerView = useBreakpointValue<'auto' | number>({ base: 1, lg: 'auto' });
  const contents = [
    'images/test/banner-1.png',
    'images/test/banner-2.png',
    'images/test/banner-3.png',
  ];
  return (
    <Flex h="100%" bgColor="blue.500">
      <Swiper
        updateOnWindowResize
        spaceBetween={120}
        slidesPerView={slidesPerView}
        centeredSlides
        loop
        grabCursor
        loopedSlides={3}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]}
        style={{ height: '100%', paddingBottom: '40px' }} // spacing 5
        autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
      >
        {contents.map((item, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <SwiperSlide
            style={{
              margin: '0 auto',
              width: 1000,
              maxHeight: 500,
            }}
            key={item}
          >
            {(slideProps) => {
              return <MarketCarouselItem isActive={slideProps.isActive} item={item} />;
            }}
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
}

interface MarketCarouselItemProps {
  isActive: boolean;
  item: string;
}
const MarketCarouselItem = ({ isActive, item }: MarketCarouselItemProps): JSX.Element => {
  const swiper = useSwiper();
  const onSlideNext = (): void => swiper.slideNext();
  const onSlidePrev = (): void => swiper.slidePrev();
  return (
    <SwiperSlideItem
      key={item}
      isActive={isActive}
      onSlideNext={onSlideNext}
      onSlidePrev={onSlidePrev}
    >
      <Image src={item} />
    </SwiperSlideItem>
  );
};

export default MarketCarousel;
