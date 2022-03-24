import { Box, LinkBox, LinkOverlay, Stack, Text, useBoolean } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { motion } from 'framer-motion';
import { Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import NextLink from 'next/link';
import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

const variants = {
  scale: { scale: 1.1 },
  normal: { scale: 1.0 },
};

/** 검색결과 - 상품아이템 => 쇼핑탭에서 작성한 상품컴포넌트와 비슷할듯하다 => 확인 후 수정필요
 */
function GoodsCard({ item }: { item: SearchResultItem }): JSX.Element {
  const [mouseOver, setMouseOver] = useBoolean(false);
  return (
    <LinkBox onMouseOver={setMouseOver.on} onMouseOut={setMouseOver.off}>
      <NextLink href={item.linkUrl} passHref>
        <LinkOverlay isExternal={item.linkUrl.includes('http')}>
          <Stack minW="132px">
            <Box rounded="xl" overflow="hidden" position="relative">
              <motion.img
                src={item.imageUrl}
                initial="normal"
                animate={mouseOver ? 'scale' : 'normal'}
                variants={variants}
                style={{ objectFit: 'cover' }}
              />
              <Icon
                as={ArrowForwardIcon}
                position="absolute"
                right={2}
                bottom={2}
                color="white"
                rounded="full"
                bg="rgba(0,0,0,0.4)"
                p={1}
                boxSize="2em"
              />
            </Box>
            <Text fontFamily="Gmarket Sans" textAlign="center">
              {item.title}
            </Text>
          </Stack>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}

export interface SearchResultGoodsSectionProps {
  data: SearchResultItem[];
}
export function SearchResultGoodsSection({
  data,
}: SearchResultGoodsSectionProps): JSX.Element {
  return (
    <SearchResultSectionContainer title="상품" resultCount={data.length}>
      {data.length > 0 ? (
        <>
          {/* (breakpoint: md 이상 기준) 상품 검색결과 목록 */}
          <Box display={{ base: 'none', md: 'block' }}>
            <Swiper
              scrollbar
              modules={[Pagination, Scrollbar]}
              slidesPerView="auto"
              spaceBetween={30}
            >
              {data.map((item, index) => {
                const key = `${item.title}_${index}`;
                return (
                  <SwiperSlide key={key} style={{ width: '20%', paddingBottom: '32px' }}>
                    <GoodsCard key={key} item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
          {/* (breakpoint: md 미만 기준) 상품 검색결과 목록 - 그리드 */}
          <Box display={{ base: 'block', md: 'none' }} />
        </>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainer>
  );
}

export default SearchResultGoodsSection;
