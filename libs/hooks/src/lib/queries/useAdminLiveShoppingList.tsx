import { FindLiveShoppingDto, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminLiveShoppingList = async (
  dto: FindLiveShoppingDto,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('admin/live-shoppings', { params: dto })
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (
  dto: FindLiveShoppingDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminLiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getAdminLiveShoppingList(dto || null),
    options,
  );
};
