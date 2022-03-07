import { LiveShoppingImageDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminLiveShoppingImageMutationRes = boolean;

export const useAdminLiveShoppingImageMutation = (): UseMutationResult<
  useAdminLiveShoppingImageMutationRes,
  AxiosError,
  LiveShoppingImageDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminLiveShoppingImageMutationRes,
    AxiosError,
    LiveShoppingImageDto
  >(
    (dto: LiveShoppingImageDto) =>
      axios
        .post<useAdminLiveShoppingImageMutationRes>('/admin/live-shopping/images', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminGoodsList');
      },
    },
  );
};
