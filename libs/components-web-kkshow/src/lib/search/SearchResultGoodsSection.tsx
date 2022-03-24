import { Box, useBreakpointValue } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsCard } from './GoodsCard';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

export interface SearchResultGoodsSectionProps {
  data: SearchResultItem[];
}
export function SearchResultGoodsSection({
  data,
}: SearchResultGoodsSectionProps): JSX.Element {
  // 모바일에서는 4개, 데스트탑에서는 최대 6개 표시 -> 나머지는 더보기 눌러서 별도 페이지에서 확인하도록

  const displayLimitOnSearchResultPage = useBreakpointValue({ base: 4, md: 6 });
  return (
    <SearchResultSectionContainer title="상품" resultCount={data.length}>
      {data.length > 0 ? (
        <>
          {/* (breakpoint: md 이상 기준) */}
          <Box display={{ base: 'none', md: 'block' }}>
            <Swiper
              scrollbar
              modules={[Pagination, Scrollbar]}
              slidesPerView="auto"
              spaceBetween={30}
            >
              {data.slice(0, displayLimitOnSearchResultPage).map((item, index) => {
                const key = `${item.title}_${index}`;
                return (
                  <SwiperSlide key={key} style={{ width: '20%', paddingBottom: '32px' }}>
                    <GoodsCard key={key} item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
          {/* (breakpoint: md 미만 기준) - 그리드 */}
          <Box display={{ base: 'block', md: 'none' }} />
        </>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainer>
  );
}

export default SearchResultGoodsSection;
