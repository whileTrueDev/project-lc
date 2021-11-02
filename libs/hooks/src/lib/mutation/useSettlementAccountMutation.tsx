import { useMutation, UseMutationResult } from 'react-query';
import { SettlementAccountDto } from '@project-lc/shared-types';
import { SellerSettlementAccount } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useSettlementAccountMutation = (): UseMutationResult<
  SellerSettlementAccount,
  AxiosError,
  SettlementAccountDto
> => {
  return useMutation<SellerSettlementAccount, AxiosError, SettlementAccountDto>(
    async (dto: SettlementAccountDto) => {
      return axios
        .post<SellerSettlementAccount>('/seller/settlement-account', dto)
        .then((res) => res.data);
    },
  );
};
