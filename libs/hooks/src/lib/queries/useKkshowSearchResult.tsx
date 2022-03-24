import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SearchResult, SearchResultItem } from '@project-lc/shared-types';
import axios from '../../axios';

export type KkshowSearchResult = SearchResult;

const initialData: KkshowSearchResult = {
  goods: [],
  liveContents: [],
  broadcasters: [],
};

const images = {
  goods: [
    'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449180896963view.jpg',
    'https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png',
  ],
  liveContents: [
    'https://cdn.zeplin.io/614c03ad63951cb7d7158fbb/assets/352f5a75-5e31-4aad-b0f5-83ab618cec0b.png',
    'https://cdn.zeplin.io/614c03ad63951cb7d7158fbb/assets/e6a8d3fd-a0d0-43d2-8e0b-842984c015d2.png',
  ],
  broadcasters: [
    'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-150x150.png',
    'https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png',
  ],
};

function generateDummyList(
  type: 'goods' | 'liveContents' | 'broadcasters',
  num: number,
): SearchResultItem[] {
  const arr = new Array(num).fill({
    imageUrl: '',
    linkUrl: '',
    title: '',
  });
  if (type === 'goods') {
    return arr.map((_, index) => ({
      imageUrl: images.goods[index % 2 === 0 ? 0 : 1],
      linkUrl: 'https://k-kmarket.com/goods/view?no=179',
      title: `더미데이터 ${index + 1}_백종원의 3대천왕 출연 속초 닭강정 (순한 맛)`,
    }));
  }
  if (type === 'broadcasters') {
    return arr.map((_, index) => ({
      imageUrl: images.broadcasters[index % 2 === 0 ? 0 : 1],
      linkUrl: 'https://k-kmarket.com/goods/catalog?code=00160001',
      title: `더미 방송인${index + 1} `,
    }));
  }
  if (type === 'liveContents') {
    return arr.map((_, index) => ({
      imageUrl: images.liveContents[index % 2 === 0 ? 0 : 1],
      linkUrl: 'https://youtu.be/4Bkuhi7i7Mk',
      title: `[더미데이터 x ${index + 1}] 라이브 커머스 방송`,
    }));
  }
  return [];
}

// TODO: 백엔드 요청 연결 후 삭제 요망
const dummyData: KkshowSearchResult = {
  goods: generateDummyList('goods', 33),
  liveContents: generateDummyList('liveContents', 12),
  broadcasters: generateDummyList('broadcasters', 16),
};

export const getKkshowSearchResult = async (
  keyword?: string,
): Promise<KkshowSearchResult> => {
  // TODO: 백엔드 요청 연결 후 수정 필요
  if (keyword) return Promise.resolve(dummyData);
  return Promise.resolve(initialData);
  // return axios.get<KkshowSearchResult>('/').then((res) => res.data);
};

export const useKkshowSearchResult = (
  keyword?: string,
): UseQueryResult<KkshowSearchResult, AxiosError> => {
  return useQuery<KkshowSearchResult, AxiosError>(
    ['KkshowSearchResult', { keyword }],
    () => getKkshowSearchResult(keyword),
    {
      initialData,
    },
  );
};
