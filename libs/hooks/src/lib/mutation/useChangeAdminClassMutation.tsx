import { Administrator } from '@prisma/client';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { AdminClassDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type AdminClassDtoWithoutId = Omit<AdminClassDto, 'id'>;

export const useChangeAdminClassMutation = (): UseMutationResult<
  Administrator,
  AxiosError,
  AdminClassDtoWithoutId
> => {
  return useMutation<Administrator, AxiosError, AdminClassDtoWithoutId>(
    (dto: AdminClassDtoWithoutId) =>
      axios.patch('/admin/admin-class', dto).then((res) => res.data),
  );
};
