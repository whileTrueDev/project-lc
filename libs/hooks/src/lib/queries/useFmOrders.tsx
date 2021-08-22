import { useQuery } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
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
      },
    })
    .then((res) => res.data);
};

export const useFmOrders = (dto: FindFmOrdersDto) => {
  return useQuery<FindFmOrderRes[]>(
    [
      'FmOrders',
      dto.search,
      dto.searchDateType,
      dto.searchEndDate,
      dto.searchStartDate,
      dto.searchStatuses,
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
