import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { AdminClassDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type AdminClassDtoId = Pick<AdminClassDto, 'id'>;

export const useDeleteAdminUserMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  AdminClassDtoId
> => {
  const queryClient = useQueryClient();

  return useMutation<boolean, AxiosError, AdminClassDtoId>(
    (userId: AdminClassDtoId) =>
      axios.delete(`/admin/user/${userId}`).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getAdminManagerList');
      },
    },
  );
};
