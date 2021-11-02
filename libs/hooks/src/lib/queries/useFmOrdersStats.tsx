import { useQuery, UseQueryResult } from 'react-query';
import { OrderStatsRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersStats = async (): Promise<OrderStatsRes> => {
  return axios.get<OrderStatsRes>('/fm-orders/stats').then((res) => res.data);
};

export const useFmOrdersStats = (): UseQueryResult<OrderStatsRes, AxiosError> => {
  return useQuery<OrderStatsRes, AxiosError>(['FmOrdersStats'], () => getFmOrdersStats());
};
