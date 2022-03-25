import { Box, GridItem, Heading, useBreakpointValue } from '@chakra-ui/react';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { KkshowShoppingTabReviewData } from '@project-lc/shared-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsReviewDisplay } from '../GoodsReviewDisplay';
import KkshowMainTitle from '../main/KkshowMainTitle';

const items: KkshowShoppingTabReviewData[] = [
  {
    contents:
      '굴림만두를 처음 먹어본건데 신기하고 맛도 좋네요. 어쩌고 저쩌고 이러쿵 저러쿵 리뷰 씁니다.',
    title: '양도 많고 맛있어요',
    createDate: new Date(),
    rating: 4,
    imageUrl: 'images/test/thum-17.png',
    linkUrl: '#',
  },
  {
    contents: '짧은리뷰내용입니다.',
    title: '리뷰제목123123',
    createDate: new Date(),
    rating: 5,
    imageUrl: 'images/test/thum-18.png',
    linkUrl: '#',
  },
  {
    contents:
      '리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄리뷰가 엄청엄청길 떄.',
    title: '리뷰제목33333',
    createDate: new Date(),
    rating: 3.5,
    imageUrl: 'images/test/thum-19.png',
    linkUrl: '#',
  },
  {
    contents:
      '오랜만이야 전부다 좋아 보여 짧게자른 그 머리 환하게 웃는 미소가 처음이야 네가 밉게 느껴져 아마 넌 울고싶던 기억을 다 지운것 같아',
    title: '리뷰제목44444',
    createDate: new Date(),
    rating: 1,
    imageUrl: 'images/test/thum-20.png',
    linkUrl: '#',
  },
];
export function ShoppingReviews(): JSX.Element {
  return (
    <Box mx="auto" maxW="5xl" py={[10, 20]} px={2}>
      <KkshowMainTitle
        centered={false}
        distance={8}
        bulletSize={6}
        bulletPosition="left"
        color="blue.500"
      >
        <Heading as="p" color="blue.500" fontSize="2xl">
          생생후기
        </Heading>
      </KkshowMainTitle>

      <FadeUp>
        <Swiper
          style={{ paddingTop: 24, paddingBottom: 24 }}
          spaceBetween={16}
          slidesPerView={useBreakpointValue({ base: 'auto', md: 4 })}
        >
          {items.map((item) => (
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

export default ShoppingReviews;
