import { useMutation } from 'react-query';
import { SettlementAccountDto } from '@project-lc/shared-types';
import { SellerSettlementAccount } from '@prisma/client';
import axios from '../../axios';

export const useSettlementAccountMutation = () => {
  return useMutation((dto: SettlementAccountDto) => {
    return axios.post<SellerSettlementAccount>('/seller/settlement-account', dto);
  });
};
