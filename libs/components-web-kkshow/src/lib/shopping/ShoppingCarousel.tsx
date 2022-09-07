import { Flex, LinkBox, LinkOverlay, useBreakpointValue } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useKkshowShopping } from '@project-lc/hooks';
import { KkshowShoppingTabCarouselItem } from '@project-lc/shared-types';
import Link from 'next/link';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import SwiperSlideItem from '../SwiperSlideItem';

export function ShoppingCarousel(): JSX.Element | null {
  const { data } = useKkshowShopping();
  const slidesPerView = useBreakpointValue<'auto' | number>({ base: 1, lg: 'auto' });
  if (!data) return null;
  return (
    <Flex h="100%" bgColor="blue.500">
      <Swiper
        updateOnWindowResize
        spaceBetween={120}
        slidesPerView={slidesPerView || 'auto'}
        centeredSlides
        loop
        grabCursor
        loopedSlides={3}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]}
        style={{ height: '100%', paddingBottom: '40px' }} // spacing 5
        autoplay={{ delay: 5 * 1000, disableOnInteraction: false }}
      >
        {data &&
          data.carousel.map((item) => (
            <SwiperSlide
              style={{
                margin: '0 auto',
                width: '100%',
                height: '100%',
                maxWidth: 1000,
                maxHeight: 500,
              }}
              key={item.description + item.imageUrl}
            >
              {(slideProps) => {
                return <ShoppingCarouselItem isActive={slideProps.isActive} {...item} />;
              }}
            </SwiperSlide>
          ))}
      </Swiper>
    </Flex>
  );
}

interface ShoppingCarouselItemProps extends KkshowShoppingTabCarouselItem {
  isActive: boolean;
}
const ShoppingCarouselItem = ({
  isActive,
  imageUrl,
  linkUrl,
}: ShoppingCarouselItemProps): JSX.Element => {
  const swiper = useSwiper();
  const onSlideNext = (): void => swiper.slideNext();
  const onSlidePrev = (): void => swiper.slidePrev();
  return (
    <SwiperSlideItem
      isActive={isActive}
      onSlideNext={onSlideNext}
      onSlidePrev={onSlidePrev}
    >
      <LinkBox position="relative" h="500px" w="100%">
        <Link href={linkUrl} passHref>
          <LinkOverlay>
            <ChakraNextImage
              layout="fixed"
              width="1000px"
              height="500px"
              quality={100}
              src={imageUrl}
              objectFit="contain"
            />
          </LinkOverlay>
        </Link>
      </LinkBox>
    </SwiperSlideItem>
  );
};

export default ShoppingCarousel;
