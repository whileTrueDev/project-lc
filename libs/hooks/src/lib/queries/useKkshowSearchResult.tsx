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
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c841296a-b1a7-48ee-9133-f35a413ec33d/%EC%8D%B8%EB%84%A4%EC%9D%BC_2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220323T063516Z&X-Amz-Expires=86400&X-Amz-Signature=7341efd919a95bbbf26e04d25a8ac88ed989d231eb635de96b1203e6e4b0ca91&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%258D%25B8%25EB%2584%25A4%25EC%259D%25BC_2.jpg%22&x-id=GetObject',
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bed12326-1680-4c7b-bafc-9f03eed8e9f6/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220323T063536Z&X-Amz-Expires=86400&X-Amz-Signature=4838e1b0d1bf5581a88acbf2dc1bba92b88b27c65dc8e3db5de3a0fc5de4065e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%258D%25B8%25EB%2584%25A4%25EC%259D%25BC.jpg%22&x-id=GetObject',
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
  goods: generateDummyList('goods', 20),
  liveContents: generateDummyList('liveContents', 20),
  broadcasters: generateDummyList('broadcasters', 10),
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
