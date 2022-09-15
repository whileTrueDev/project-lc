import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminLatestCheckedDataMutationDto = Record<string, number>;
export type useAdminLatestCheckedDataMutationRes = boolean;

export const useAdminLatestCheckedDataMutation = (): UseMutationResult<
  useAdminLatestCheckedDataMutationRes,
  AxiosError,
  useAdminLatestCheckedDataMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminLatestCheckedDataMutationRes,
    AxiosError,
    useAdminLatestCheckedDataMutationDto
  >(
    (dto: useAdminLatestCheckedDataMutationDto) =>
      axios
        .post<useAdminLatestCheckedDataMutationRes>('admin/tab-alarm/checkedData', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminLatestCheckedData');
        queryClient.invalidateQueries('AdminSidebarNotiCounts');
      },
    },
  );
};
