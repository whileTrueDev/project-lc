import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface UpdateStatus {
  returnCode: string;
  status: string;
}

export const useUpdateReturnStatusMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  UpdateStatus
> => {
  return useMutation((dto: UpdateStatus) =>
    axios.patch('/fm-orders/return-status', dto).then((res) => res.data),
  );
};
