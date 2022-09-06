import { CreateOverlayThemeDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 오버레이 테마 생성 뮤테이션 훅 */
export type CreateOverlayThemeMutationRes = any;
export const useAdminOverlayThemeCreateMutation = (): UseMutationResult<
  CreateOverlayThemeMutationRes,
  AxiosError,
  CreateOverlayThemeDto
> => {
  const queryClient = useQueryClient();
  return useMutation<CreateOverlayThemeMutationRes, AxiosError, CreateOverlayThemeDto>(
    (dto: CreateOverlayThemeDto) =>
      axios
        .post<CreateOverlayThemeMutationRes>('/admin/overlay-theme', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminOverlayThemeList', { refetchInactive: true });
      },
    },
  );
};

/** 오버레이 테마 삭제 뮤테이션 훅 */
export const useAdminOverlayThemeDeleteMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  { id: number }
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, { id: number }>(
    ({ id }) =>
      axios.delete<boolean>(`/admin/overlay-theme/${id}`).then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('AdminOverlayThemeList', { refetchInactive: true });
      },
    },
  );
};
