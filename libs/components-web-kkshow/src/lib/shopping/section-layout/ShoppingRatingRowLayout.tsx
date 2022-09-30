import { Box, GridItem, Heading, useBreakpointValue } from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabReviewData } from '@project-lc/shared-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsReviewDisplay } from '../../GoodsReviewDisplay';
import KkshowMainTitle from '../../main/KkshowMainTitle';

export function ShoppingRatingRowLayout({
  title,
  data,
}: {
  title: string;
  description?: string;
  data: KkshowShoppingTabReviewData[];
}): JSX.Element {
  return (
    <Box mx="auto" maxW="5xl" py={[10, 20]} px={2}>
      <KkshowMainTitle
        centered={false}
        distance={8}
        bulletSize={6}
        bulletPosition="left"
        color="blue.500"
      >
        <Heading as="p" color="blue.500" fontSize={['xl', '2xl']}>
          {title}
        </Heading>
      </KkshowMainTitle>

      <FadeUp>
        <Swiper
          style={{ paddingTop: 24, paddingBottom: 24 }}
          spaceBetween={16}
          slidesPerView={useBreakpointValue({ base: 'auto', md: 4 })}
        >
          {data.map((item) => (
            <SwiperSlide key={item.title} style={{ width: '80%', maxWidth: 300 }}>
              <FadeUp isChild boxProps={{ as: GridItem }} key={item.title}>
                <GoodsReviewDisplay review={item} variant="seperated" />
              </FadeUp>
            </SwiperSlide>
          ))}
        </Swiper>
      </FadeUp>
    </Box>
  );
}

export default ShoppingRatingRowLayout;
