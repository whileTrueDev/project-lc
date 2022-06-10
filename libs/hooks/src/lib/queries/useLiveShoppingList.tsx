import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import {
  FindLiveShoppingDto,
  LiveShoppingOutline,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';
import { Broadcaster } from '@prisma/client';
import axios from '../../axios';

export const getLiveShoppingList = async (
  dto: FindLiveShoppingDto,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/live-shoppings', {
      params: dto,
    })
    .then((res) => res.data);
};

export const useLiveShoppingList = (
  dto: FindLiveShoppingDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['LiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getLiveShoppingList(dto || null),
    options,
  );
};

export const getLiveShoppingNowPlaying = async (
  broadcasterId: Broadcaster['id'],
): Promise<LiveShoppingOutline[]> => {
  return axios
    .get<LiveShoppingOutline[]>('/live-shoppings/now-playing', {
      params: { broadcasterId },
    })
    .then((res) => res.data);
};

/** 현재 진행중인 라이브쇼핑 목록 조회 */
export const useLiveShoppingNowPlaying = (
  broadcasterId?: Broadcaster['id'] | string,
): UseQueryResult<LiveShoppingOutline[], AxiosError> => {
  const queryKey = ['LiveShoppingNowPlaying', broadcasterId];
  const bcId = Number(broadcasterId);
  return useQuery<LiveShoppingOutline[], AxiosError>(
    queryKey,
    () => getLiveShoppingNowPlaying(bcId),
    { enabled: !!bcId },
  );
};
