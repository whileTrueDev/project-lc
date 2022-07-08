import {
  FindLiveShoppingDto,
  FindNowPlayingLiveShoppingDto,
  LiveShoppingOutline,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
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

export const getLiveShoppingNowOnLive = async (
  dto: FindNowPlayingLiveShoppingDto,
): Promise<LiveShoppingOutline[]> => {
  return axios
    .get<LiveShoppingOutline[]>('/live-shoppings/now-on-live', {
      params: dto,
    })
    .then((res) => res.data);
};

/** 현재 진행중인 라이브쇼핑 목록 조회 */
export const useLiveShoppingNowOnLive = (
  dto: FindNowPlayingLiveShoppingDto,
): UseQueryResult<LiveShoppingOutline[], AxiosError> => {
  const queryKey = ['LiveShoppingNowOnLive', dto];
  return useQuery<LiveShoppingOutline[], AxiosError>(
    queryKey,
    () => getLiveShoppingNowOnLive(dto),
    { enabled: !(!dto.broadcasterId && !dto.goodsId && !dto.goodsIds) },
  );
};
