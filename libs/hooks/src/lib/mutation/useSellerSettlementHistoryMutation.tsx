import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
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
  sellerId?: number;
}

export const useSellerSettlementHistoryMutation = (): UseMutationResult<
  SellerSettlementConfirmHistory,
  AxiosError,
  SellerSettlementHistoryType
> => {
  const queryClient = useQueryClient();

  return useMutation<
    SellerSettlementConfirmHistory,
    AxiosError,
    SellerSettlementHistoryType
  >(
    async (dto: SellerSettlementHistoryType) =>
      axios
        .post<SellerSettlementConfirmHistory>('/seller/settlement/history', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerSettlementHistory');
      },
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
