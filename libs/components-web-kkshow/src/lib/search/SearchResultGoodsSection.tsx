import { Box, useBreakpointValue, Button } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { Pagination, Scrollbar, Grid as SwiperGrid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoodsCard } from './GoodsCard';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

function SeeMoreButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <Button variant="link" colorScheme="blue" onClick={onClick}>
      더보기
    </Button>
  );
}
export interface SearchResultGoodsSectionProps {
  data: SearchResultItem[];
  keyword?: string;
}
export function SearchResultGoodsSection({
  data,
  keyword,
}: SearchResultGoodsSectionProps): JSX.Element {
  const router = useRouter();
  // 모바일에서는 4개, 데스트탑에서는 최대 6개 표시 -> 나머지는 더보기 눌러서 별도 페이지에서 확인하도록
  const displayLimitOnSearchResultPage = useBreakpointValue({ base: 4, md: 6 });
  return (
    <SearchResultSectionContainer
      title="상품"
      resultCount={data.length}
      actionButton={
        keyword ? (
          <SeeMoreButton
            onClick={() => {
              router.push(`/search/goods?keyword=${keyword}`);
            }}
          />
        ) : undefined
      }
    >
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
                    <GoodsCard item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
          {/* (breakpoint: md 미만 기준) - 그리드 */}
          <Box display={{ base: 'block', md: 'none' }}>
            <Swiper
              modules={[SwiperGrid]}
              slidesPerView={2}
              grid={{ rows: 2, fill: 'row' }}
              spaceBetween={30}
            >
              {data.slice(0, displayLimitOnSearchResultPage).map((item, index) => {
                const key = `${item.title}_${index}`;
                return (
                  <SwiperSlide key={key} style={{ width: '50%' }}>
                    <GoodsCard key={key} item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainer>
  );
}

export default SearchResultGoodsSection;
