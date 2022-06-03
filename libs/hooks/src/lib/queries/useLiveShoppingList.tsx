import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { FindLiveShoppingDto, LiveShoppingWithGoods } from '@project-lc/shared-types';
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
