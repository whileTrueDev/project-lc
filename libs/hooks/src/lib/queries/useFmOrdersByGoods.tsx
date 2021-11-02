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

export const getAdminFmOrdersByGoods = async (
  dto: FindFmOrdersDto,
): Promise<FindFmOrderRes[]> => {
  return axios
    .get<FindFmOrderRes[]>('/fm-orders/admin', {
      params: {
        searchStatuses: dto.searchStatuses,
        goodsIds: dto.goodsIds,
        searchStartDate: dto?.searchStartDate || undefined,
        searchEndDate: dto?.searchEndDate || undefined,
      },
    })
    .then((res) => res.data);
};

export const useFmOrdersByGoods = (
  dto: FindFmOrdersDto,
  options?: UseQueryOptions<FindFmOrderRes[], AxiosError>,
  type?: 'admin' | undefined,
): UseQueryResult<FindFmOrderRes[], AxiosError> => {
  const fetchFunction = type === 'admin' ? getAdminFmOrdersByGoods : getFmOrdersByGoods;

  return useQuery<FindFmOrderRes[], AxiosError>(
    ['FmOrders', dto.searchStatuses, dto.goodsIds],
    () => fetchFunction(dto),
    options,
  );
};
