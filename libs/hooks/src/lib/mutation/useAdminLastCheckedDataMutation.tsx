import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminLastCheckedDataMutationDto = Record<string, number>;
export type useAdminLastCheckedDataMutationRes = boolean;

export const useAdminLastCheckedDataMutation = (): UseMutationResult<
  useAdminLastCheckedDataMutationRes,
  AxiosError,
  useAdminLastCheckedDataMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminLastCheckedDataMutationRes,
    AxiosError,
    useAdminLastCheckedDataMutationDto
  >(
    (dto: useAdminLastCheckedDataMutationDto) =>
      axios
        .post<useAdminLastCheckedDataMutationRes>('admin/tab-alarm/checkedData', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminLastCheckedData');
        queryClient.invalidateQueries('AdminSidebarNotiCounts');
      },
    },
  );
};
