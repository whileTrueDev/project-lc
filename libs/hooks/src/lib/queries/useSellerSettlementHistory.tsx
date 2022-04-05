import { SellerSettlementConfirmHistory } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getSellerSettlementHistory = async (): Promise<
  SellerSettlementConfirmHistory[]
> => {
  return axios
    .get<SellerSettlementConfirmHistory[]>('/seller/settlement/history', {})
    .then((res) => res.data);
};

export const useSellerSettlementHistory = (): UseQueryResult<
  SellerSettlementConfirmHistory[],
  AxiosError
> => {
  const queryKey = ['SellerSettlementHistory'];
  return useQuery<SellerSettlementConfirmHistory[], AxiosError>(queryKey, () =>
    getSellerSettlementHistory(),
  );
};
