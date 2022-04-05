import { useMutation, UseMutationResult } from 'react-query';
import { SellerSettlementConfirmHistory, SellerPaperType } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export type SellerPaperTypeWithSellerId = SellerPaperType & {
  sellerId: number;
};

export const useSellerSettlementHistoryMutation = (): UseMutationResult<
  SellerSettlementConfirmHistory,
  AxiosError,
  SellerPaperType
> => {
  return useMutation<SellerSettlementConfirmHistory, AxiosError, SellerPaperType>(
    async (dto: SellerPaperType) => {
      return axios
        .post<SellerSettlementConfirmHistory>('/seller/settlement/history', dto)
        .then((res) => res.data);
    },
  );
};

export const useAdminSellerSettlementHistoryMutation = (): UseMutationResult<
  SellerSettlementConfirmHistory,
  AxiosError,
  SellerPaperTypeWithSellerId
> => {
  return useMutation<
    SellerSettlementConfirmHistory,
    AxiosError,
    SellerPaperTypeWithSellerId
  >(async (dto: SellerPaperTypeWithSellerId) => {
    return axios
      .post<SellerSettlementConfirmHistory>(
        '/admin/settlement-info/confirmation/history',
        dto,
      )
      .then((res) => res.data);
  });
};
