import { SearchResultItem } from '@project-lc/shared-types';
import { Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BestBroadcasterItem } from '../main/KkshowMainBestBroadcaster';
import {
  SearchResultEmptyText,
  SearchResultSectionContainer,
} from './SearchResultSectionContainer';

export interface SearchResultBroadcasterSectionProps {
  data: SearchResultItem[];
}
export function SearchResultBroadcasterSection({
  data,
}: SearchResultBroadcasterSectionProps): JSX.Element {
  return (
    <SearchResultSectionContainer title="방송인" resultCount={data.length}>
      {data.length > 0 ? (
        <Swiper
          style={{ paddingTop: 24, paddingBottom: 24, width: '100%' }}
          spaceBetween={16}
          slidesPerView="auto"
          modules={[Pagination, Scrollbar]}
        >
          {data.map((x) => (
            <SwiperSlide key={x.title} style={{ maxWidth: 190, paddingBottom: 24 }}>
              <BestBroadcasterItem
                avatarUrl={x.imageUrl}
                broadcasterName={x.title}
                href={x.linkUrl}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <SearchResultEmptyText />
      )}
    </SearchResultSectionContainer>
  );
}

export default SearchResultBroadcasterSection;
