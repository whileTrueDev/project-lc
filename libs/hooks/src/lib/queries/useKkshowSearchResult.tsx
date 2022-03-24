import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SearchResult } from '@project-lc/shared-types';
import axios from '../../axios';

export type KkshowSearchResult = SearchResult;

const initialData: KkshowSearchResult = {
  goods: [],
  liveContents: [],
  broadcasters: [],
};

// TODO: 백엔드 요청 연결 후 삭제 요망
const dummyData: KkshowSearchResult = {
  goods: [
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449180896963view.jpg',
      linkUrl: 'https://k-kmarket.com/goods/view?no=182',
      title: '백종원의 3대천왕 출연 속초 닭강정 (순한 맛)',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449174261446view.jpg',
      linkUrl: 'https://k-kmarket.com/goods/view?no=181',
      title: '백종원의 3대천왕 출연 속초 닭강정 (더 매운 맛)',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png',
      linkUrl: 'https://k-kmarket.com/goods/view?no=178',
      title: '돼지 등뼈와 우거지가 가득한 뼈해장국',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449174261446view.jpg',
      linkUrl: 'https://k-kmarket.com/goods/view?no=181',
      title: '백종원의 3대천왕 출연 속초 닭강정 (더 매운 맛)',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png',
      linkUrl: 'https://k-kmarket.com/goods/view?no=178',
      title: '돼지 등뼈와 우거지가 가득한 뼈해장국',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449174261446view.jpg',
      linkUrl: 'https://k-kmarket.com/goods/view?no=181',
      title: '백종원의 3대천왕 출연 속초 닭강정 (더 매운 맛)',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png',
      linkUrl: 'https://k-kmarket.com/goods/view?no=178',
      title: '돼지 등뼈와 우거지가 가득한 뼈해장국',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16449174261446view.jpg',
      linkUrl: 'https://k-kmarket.com/goods/view?no=181',
      title: '백종원의 3대천왕 출연 속초 닭강정 (더 매운 맛)',
    },
    {
      imageUrl: 'https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png',
      linkUrl: 'https://k-kmarket.com/goods/view?no=178',
      title: '돼지 등뼈와 우거지가 가득한 뼈해장국',
    },
  ],
  liveContents: [
    {
      imageUrl:
        'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c841296a-b1a7-48ee-9133-f35a413ec33d/%EC%8D%B8%EB%84%A4%EC%9D%BC_2.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220323T063516Z&X-Amz-Expires=86400&X-Amz-Signature=7341efd919a95bbbf26e04d25a8ac88ed989d231eb635de96b1203e6e4b0ca91&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%258D%25B8%25EB%2584%25A4%25EC%259D%25BC_2.jpg%22&x-id=GetObject',
      linkUrl: 'https://youtu.be/4Bkuhi7i7Mk',
      title: '[쵸단 X 귀빈정] 해피쵸이어',
    },
    {
      imageUrl:
        'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bed12326-1680-4c7b-bafc-9f03eed8e9f6/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220323%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220323T063536Z&X-Amz-Expires=86400&X-Amz-Signature=4838e1b0d1bf5581a88acbf2dc1bba92b88b27c65dc8e3db5de3a0fc5de4065e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EC%258D%25B8%25EB%2584%25A4%25EC%259D%25BC.jpg%22&x-id=GetObject',
      linkUrl: 'https://youtu.be/3TLj00xYR-k',
      title: '[나는야꼬등어 X 동래아들] 메리크크쇼마스',
    },
  ],
  broadcasters: [
    {
      title: '쵸단',
      imageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-150x150.png',
      linkUrl: 'https://k-kmarket.com/goods/catalog?code=00160001',
    },
    {
      title: '민결희',
      imageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png',
      linkUrl: 'https://k-kmarket.com/goods/catalog?code=00160003',
    },
    {
      title: '나무늘봉순',
      imageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/5f179460-761b-404e-afc6-9ec9ea26df1a-profile_image-150x150.png',
      linkUrl: 'https://k-kmarket.com/goods/catalog?code=00160002',
    },
  ],
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
