import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminLiveShoppingList = async (
  liveShoppingId?: string | null,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/admin/live-shoppings', {
      params: { liveShoppingId },
    })
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (dto: {
  enabled: boolean;
  id?: string;
}): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminGoodsList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(queryKey, () =>
    getAdminLiveShoppingList(dto.id || null),
  );
};
