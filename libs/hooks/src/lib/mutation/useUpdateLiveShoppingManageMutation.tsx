import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const useUpdateLiveShoppingManageMutation = (): UseMutationResult<
  any,
  AxiosError,
  any
> => {
  return useMutation<any, AxiosError, any>((dto: any) =>
    axios.patch('/admin/live-shopping', dto).then((res) => res.data),
  );
};
