import { LiveShoppingParamsDto, LiveShoppingWithGoods } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminLiveShoppingList = async (
  dto: LiveShoppingParamsDto,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('admin/live-shoppings', {
      params: {
        liveShoppingId: dto.id,
        goodsIds: dto.goodsIds,
      },
    })
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (
  dto: LiveShoppingParamsDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminLiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getAdminLiveShoppingList(dto || null),
    options,
  );
};
