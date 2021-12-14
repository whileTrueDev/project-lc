import { BroadcasterSettlementInfoConfirmationDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type Res = boolean;

export const useAdminBroadcasterSettlementInfoConfirmMutation = (): UseMutationResult<
  Res,
  AxiosError,
  BroadcasterSettlementInfoConfirmationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<Res, AxiosError, BroadcasterSettlementInfoConfirmationDto>(
    (dto: BroadcasterSettlementInfoConfirmationDto) =>
      axios
        .patch<Res>('/admin/settlement-info/broadcaster/confirmation', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminBroadcasterSettlementInfoList');
      },
    },
  );
};
