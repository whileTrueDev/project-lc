import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersByGoods = async (
  dto: FindFmOrdersDto,
): Promise<FindFmOrderRes[]> => {
  return axios
    .get<FindFmOrderRes[]>('/fm-orders', {
      params: {
        searchStatuses: dto.searchStatuses,
        goodsIds: dto.goodsIds,
      },
    })
    .then((res) => res.data);
};

export const useFmOrdersByGoods = (
  dto: FindFmOrdersDto,
  options?: UseQueryOptions<FindFmOrderRes[], AxiosError>,
): UseQueryResult<FindFmOrderRes[], AxiosError> => {
  return useQuery<FindFmOrderRes[], AxiosError>(
    ['FmOrders', dto.searchStatuses, dto.goodsIds],
    () => getFmOrdersByGoods(dto),
    options,
  );
};
