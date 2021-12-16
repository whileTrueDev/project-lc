import { CreateManyBroadcasterSettlementHistoryDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export type useCreateSettleBcManyMutationRes = number;

export const useCreateSettleBcManyMutation = (): UseMutationResult<
  useCreateSettleBcManyMutationRes,
  AxiosError,
  CreateManyBroadcasterSettlementHistoryDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCreateSettleBcManyMutationRes,
    AxiosError,
    CreateManyBroadcasterSettlementHistoryDto
  >(
    (dto: CreateManyBroadcasterSettlementHistoryDto) =>
      axios
        .post<useCreateSettleBcManyMutationRes>('/admin/settlement/broadcaster', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data > 0) {
          queryClient.invalidateQueries('BcSettlementTargets');
        }
      },
    },
  );
};
