import { ChangeReturnStatusDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

/** 퍼스트몰 db 반품 업데이트 훅 */
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
