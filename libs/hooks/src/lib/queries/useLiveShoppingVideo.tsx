import {
  DefaultPaginationDto,
  PaginatedLiveShoppingVideoRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import axios from '../../axios';

export interface LiveShoppingVideo {
  _field: 'default field';
}

export const getLiveShoppingVideo = async (
  dto: DefaultPaginationDto,
): Promise<PaginatedLiveShoppingVideoRes> => {
  return axios
    .get<PaginatedLiveShoppingVideoRes>('/live-shopping-video', { params: dto })
    .then((res) => res.data);
};

/**  소비자센터 주문 목록 조회 infinited query */
export const INFINITE_LIVE_VIDEO_QUERY_KEY = 'LiveShoppingVideo';
export const useInfiniteLiveShoppingVideo = (
  dto: DefaultPaginationDto,
): UseInfiniteQueryResult<PaginatedLiveShoppingVideoRes, AxiosError> => {
  return useInfiniteQuery(
    INFINITE_LIVE_VIDEO_QUERY_KEY,
    ({ pageParam = 0 }) => getLiveShoppingVideo({ ...dto, skip: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor; // 이 값이 undefined 이면 hasNextPage = false가 됨
      },
    },
  );
};
