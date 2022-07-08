import { ConfirmHistory } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getSellerSettlementHistory = async (): Promise<ConfirmHistory[]> => {
  return axios
    .get<ConfirmHistory[]>('/seller/settlement/confirmation-history', {})
    .then((res) => res.data);
};

export const useSellerSettlementHistory = (): UseQueryResult<
  ConfirmHistory[],
  AxiosError
> => {
  const queryKey = ['SellerSettlementHistory'];
  return useQuery<ConfirmHistory[], AxiosError>(queryKey, () =>
    getSellerSettlementHistory(),
  );
};
