import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ChangeReturnStatusDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const useUpdateReturnStatusMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  ChangeReturnStatusDto
> => {
  const queryClient = useQueryClient();

  return useMutation(
    (dto: ChangeReturnStatusDto) => {
      return axios.patch('/fm-orders/return-status', dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('FmOrder', { refetchInactive: true });
      },
    },
  );
};
