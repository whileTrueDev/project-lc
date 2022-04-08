import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ConfirmHistory, ConfirmHistoryDto } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useSellerSettlementHistoryMutation = (): UseMutationResult<
  ConfirmHistory,
  AxiosError,
  ConfirmHistoryDto
> => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmHistory, AxiosError, ConfirmHistoryDto>(
    async (dto: ConfirmHistoryDto) =>
      axios
        .post<ConfirmHistory>('/seller/settlement/confirmation-history', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellerSettlementHistory');
      },
    },
  );
};

export const useAdminSellerSettlementHistoryMutation = (): UseMutationResult<
  ConfirmHistory,
  AxiosError,
  ConfirmHistoryDto
> => {
  return useMutation<ConfirmHistory, AxiosError, ConfirmHistoryDto>(
    async (dto: ConfirmHistoryDto) => {
      return axios
        .post<ConfirmHistory>('/admin/settlement-info/confirmation/history', dto)
        .then((res) => res.data);
    },
  );
};
