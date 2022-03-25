import { Manual } from '@prisma/client';
import { EditManualDto, PostManualDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { ADMIN_MANUAL_QUERY_KEY } from '../queries/useAdminManualList';

/** 관리자 이용안내 생성 뮤테이션 훅 */
export const useAdminManualPostMutation = (): UseMutationResult<
  Manual,
  AxiosError,
  PostManualDto
> => {
  const queryClient = useQueryClient();
  return useMutation<Manual, AxiosError, PostManualDto>(
    (dto: PostManualDto) =>
      axios.post<Manual>('/admin/manual', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(ADMIN_MANUAL_QUERY_KEY);
      },
    },
  );
};

/** 관리자 이용안내 수정 뮤테이션 훅 */
type PatchManualDto = EditManualDto & { id: number };
export const useAdminManualEditMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  EditManualDto & { id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, PatchManualDto>(
    ({ id, ...dto }: { id: number } & EditManualDto) => {
      return axios.patch<boolean>(`/admin/manual/${id}`, dto).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(ADMIN_MANUAL_QUERY_KEY);
      },
    },
  );
};

/** 관리자 이용안내 삭제 뮤테이션 훅 */
export const useAdminManualDeleteMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, number>(
    (id: number) => {
      return axios.delete<boolean>(`/admin/manual/${id}`).then((res) => res.data);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(ADMIN_MANUAL_QUERY_KEY);
      },
    },
  );
};
