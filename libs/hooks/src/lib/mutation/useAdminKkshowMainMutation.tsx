import { KkshowMainDto, KkshowMainResData } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminKkshowMainMutationRes = KkshowMainResData;

export const useAdminKkshowMainMutation = (): UseMutationResult<
  useAdminKkshowMainMutationRes,
  AxiosError,
  KkshowMainDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminKkshowMainMutationRes, AxiosError, KkshowMainDto>(
    (dto: KkshowMainDto) =>
      axios
        .post<useAdminKkshowMainMutationRes>('/admin/kkshow-main', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('KkshowMain');
      },
    },
  );
};
