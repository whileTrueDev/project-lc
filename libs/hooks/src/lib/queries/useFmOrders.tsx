import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrders = async (dto: FindFmOrdersDto): Promise<FindFmOrderRes[]> => {
  return axios
    .get<FindFmOrderRes[]>('/fm-orders', {
      params: {
        search: dto.search,
        searchDateType: dto.searchDateType,
        searchStartDate: dto.searchStartDate,
        searchEndDate: dto.searchEndDate,
        searchStatuses: dto.searchStatuses,
        goodsIds: dto.goodsIds,
      },
    })
    .then((res) => res.data);
};

export const useFmOrders = (
  dto: FindFmOrdersDto,
): UseQueryResult<FindFmOrderRes[], AxiosError> => {
  return useQuery<FindFmOrderRes[], AxiosError>(
    [
      'FmOrders',
      dto.search,
      dto.searchDateType,
      dto.searchEndDate,
      dto.searchStartDate,
      dto.searchStatuses,
      dto.goodsIds,
    ],
    () => getFmOrders(dto),
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
