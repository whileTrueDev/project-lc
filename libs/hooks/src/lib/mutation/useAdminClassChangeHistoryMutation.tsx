import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { AdminClassChangeHistory } from '@prisma/client';
import { AdminClassChangeHistoryDtoWithoutId } from '@project-lc/shared-types';
import axios from '../../axios';

export const useAdminClassChangeHistoryMutation = (): UseMutationResult<
  AdminClassChangeHistory,
  AxiosError,
  AdminClassChangeHistoryDtoWithoutId
> => {
  return useMutation<
    AdminClassChangeHistory,
    AxiosError,
    AdminClassChangeHistoryDtoWithoutId
  >((dto: AdminClassChangeHistoryDtoWithoutId) =>
    axios
      .post<AdminClassChangeHistory>('/admin/class-change-history', dto)
      .then((res) => res.data),
  );
};
