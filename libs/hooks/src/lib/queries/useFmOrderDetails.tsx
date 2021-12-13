import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrderDetailsDto, FindFmOrderDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrderDetails = async (
  dto: FindFmOrderDetailsDto,
): Promise<FindFmOrderDetailRes[]> => {
  return axios
    .get<FindFmOrderDetailRes[]>('/fm-orders/detail', {
      params: dto,
    })
    .then((res) => res.data);
};

export const useFmOrderDetails = (
  dto: FindFmOrderDetailsDto,
): UseQueryResult<FindFmOrderDetailRes[], AxiosError> => {
  return useQuery<FindFmOrderDetailRes[], AxiosError>(
    ['FmOrderDetail', dto.orderIds],
    () => getFmOrderDetails(dto),
    {
      enabled: dto.orderIds.length > 0,
    },
  );
};
