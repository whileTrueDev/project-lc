import { ExecuteSettlementDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateSettlementMutationRes = boolean;

export const useCreateSettlementMutation = (): UseMutationResult<
  useCreateSettlementMutationRes,
  AxiosError,
  ExecuteSettlementDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useCreateSettlementMutationRes, AxiosError, ExecuteSettlementDto>(
    (dto: ExecuteSettlementDto) =>
      axios
        .post<useCreateSettlementMutationRes>('/admin/settlement', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('SettlementTargets');
        queryClient.invalidateQueries('AdminSettlementDoneList');
      },
    },
  );
};
