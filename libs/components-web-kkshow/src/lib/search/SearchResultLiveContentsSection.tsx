import { Box, useBreakpointValue } from '@chakra-ui/react';
import { SearchResultItem } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { Grid as SwiperGrid, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import LiveContentCard from './LiveContentCard';
import {
  SearchResultEmptyText,
  SearchResultSectionContainerLayout,
  SeeMoreButton,
} from './SearchResultSectionContainerLayout';

export interface SearchResultLiveContentsSectionProps {
  data: SearchResultItem[];
  keyword?: string;
}
export function SearchResultLiveContentsSection({
  data,
  keyword,
}: SearchResultLiveContentsSectionProps): JSX.Element {
  const router = useRouter();
  const displayItemCountOnSearchResultPage = useBreakpointValue({ base: 2, md: 4 });
  const dataToDisplay = data.slice(0, displayItemCountOnSearchResultPage);
  return (
    <SearchResultSectionContainerLayout
      title="라이브 컨텐츠"
      resultCount={data.length}
      actionButton={
        keyword ? (
          <SeeMoreButton
            onClick={() => {
              router.push(`/search/live-contents?keyword=${keyword}`);
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
              modules={[Pagination, Scrollbar]}
              slidesPerView="auto"
              spaceBetween={30}
            >
              {dataToDisplay.map((item, index) => {
                const key = `${item.title}_${index}`;
                return (
                  <SwiperSlide key={key} style={{ width: '40%', paddingBottom: '32px' }}>
                    <LiveContentCard item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
          {/* (breakpoint: md 미만 기준) - 그리드 */}
          <Box display={{ base: 'block', md: 'none' }}>
            <Swiper
              modules={[SwiperGrid]}
              slidesPerView={1}
              grid={{ rows: 2, fill: 'row' }}
              spaceBetween={30}
            >
              {dataToDisplay.map((item, index) => {
                const key = `${item.title}_${index}`;
                return (
                  <SwiperSlide key={key} style={{ width: '100%' }}>
                    <LiveContentCard item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainerLayout>
  );
}

export default SearchResultLiveContentsSection;
