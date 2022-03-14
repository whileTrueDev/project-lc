import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { LiveShoppingParamsDto, LiveShoppingWithGoods } from '@project-lc/shared-types';
import axios from '../../axios';

export const getLiveShoppingList = async (
  dto: LiveShoppingParamsDto,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/live-shoppings', {
      params: {
        liveShoppingId: dto.id,
        goodsIds: dto.goodsIds,
      },
    })
    .then((res) => res.data);
};

export const useLiveShoppingList = (
  dto: LiveShoppingParamsDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['LiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getLiveShoppingList(dto || null),
    options,
  );
};
