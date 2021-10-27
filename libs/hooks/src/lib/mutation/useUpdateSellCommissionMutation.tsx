import { ChangeSellCommissionDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useUpdateSellCommissionMutationRes = boolean;

export const useUpdateSellCommissionMutation = (): UseMutationResult<
  useUpdateSellCommissionMutationRes,
  AxiosError,
  ChangeSellCommissionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useUpdateSellCommissionMutationRes,
    AxiosError,
    ChangeSellCommissionDto
  >(
    (dto: ChangeSellCommissionDto) =>
      axios
        .put<useUpdateSellCommissionMutationRes>('/admin/sell-commission', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SellCommission');
      },
    },
  );
};
