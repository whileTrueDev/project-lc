import { OrderStatsRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getSellerOrderStats = async (sellerId?: number): Promise<OrderStatsRes> => {
  return axios
    .get<OrderStatsRes>('/order/stats', { params: { sellerId } })
    .then((res) => res.data);
};

export const useSellerOrderStats = (
  sellerId?: number,
): UseQueryResult<OrderStatsRes, AxiosError> => {
  return useQuery<OrderStatsRes, AxiosError>(
    ['SellerOrderStats', { sellerId }],
    () => getSellerOrderStats(sellerId),
    {
      enabled: !!sellerId,
    },
  );
};
