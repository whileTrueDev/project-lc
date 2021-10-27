import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SellCommission } from '@prisma/client';
import axios from '../../axios';

export const getSellCommission = async (): Promise<SellCommission> => {
  return axios.get<SellCommission>('/seller/sell-commission').then((res) => res.data);
};

export const useSellCommission = (
  initialData?: SellCommission,
): UseQueryResult<SellCommission, AxiosError> => {
  return useQuery<SellCommission, AxiosError>('SellCommission', getSellCommission, {
    initialData,
  });
};
