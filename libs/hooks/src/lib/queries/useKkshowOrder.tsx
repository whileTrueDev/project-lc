import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
import axios from '../../axios';

export const getKkshowOrder = async (orderId: string): Promise<any> => {
  return axios.get<any>(`/order/${orderId}`).then((res) => res.data);
};

export const useKkshowOrder = (orderId: string): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(
    ['getKkshowOrder', orderId],
    () => getKkshowOrder(orderId),
    {
      enabled: !!orderId,
    },
  );
};

export const getKkshowOrders = async (dto: FindFmOrdersDto): Promise<any> => {
  return axios.get<any>('/order', {
    params: {
      search: dto.search,
      searchDateType: dto.searchDateType,
      searchStartDate: dto.searchStartDate,
      searchEndDate: dto.searchEndDate,
      searchStatuses: dto.searchStatuses,
      goodsIds: dto.goodsIds,
    },
  });
};

export const useKkshowOrders = (
  dto: FindFmOrdersDto,
): UseQueryResult<FindFmOrderRes[], AxiosError> => {
  return useQuery<FindFmOrderRes[], AxiosError>(
    [
      'KkshowOrders',
      dto.search,
      dto.searchDateType,
      dto.searchEndDate,
      dto.searchStartDate,
      dto.searchStatuses,
      dto.goodsIds,
    ],
    () => getKkshowOrders(dto),
    {
      enabled: !!(
        dto.search ||
        dto.searchEndDate ||
        dto.searchStartDate ||
        dto.searchStatuses
      ),
    },
  );
};
