import { useMutation, UseMutationResult } from 'react-query';
import { SettlementAccountDto } from '@project-lc/shared-types';
import { SellerSettlementAccount } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useCreateLiveShopping = (): any => {
  return useMutation(async (dto: any) => {
    return axios.post<any>('/live/create', dto).then((res) => res.data);
  });
};
