import { OrderDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getOrderDetail = async (id?: number): Promise<OrderDetailRes> => {
  return axios.get<OrderDetailRes>(`/order/${id}`).then((res) => res.data);
};

export const useOrderDetail = (
  id?: number,
): UseQueryResult<OrderDetailRes, AxiosError> => {
  return useQuery<OrderDetailRes, AxiosError>(
    ['OrderDetail', id],
    () => getOrderDetail(id),
    {
      enabled: !!id,
    },
  );
};
