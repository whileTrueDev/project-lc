import { useMutation, UseMutationResult } from 'react-query';
import {
  SellerSettlementConfirmHistory,
  SellerPaperType,
  BusinessRegistrationStatus,
} from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export interface SellerSettlementHistoryType {
  type: SellerPaperType;
  status: BusinessRegistrationStatus;
  sellerId: number;
}

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
  SellerSettlementHistoryType
> => {
  return useMutation<
    SellerSettlementConfirmHistory,
    AxiosError,
    SellerSettlementHistoryType
  >(async (dto: SellerSettlementHistoryType) => {
    return axios
      .post<SellerSettlementConfirmHistory>(
        '/admin/settlement-info/confirmation/history',
        dto,
      )
      .then((res) => res.data);
  });
};
