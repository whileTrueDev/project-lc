import { Policy } from '@prisma/client';
import { CreatePolicyDto, UpdatePolicyDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

// 수정 뮤테이션 훅
export type useAdminPolicyMutationDto = UpdatePolicyDto;
export type useAdminPolicyUpdateMutationRes = Policy;

export const useAdminPolicyUpdateMutation = (
  id: number,
): UseMutationResult<
  useAdminPolicyUpdateMutationRes,
  AxiosError,
  useAdminPolicyMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminPolicyUpdateMutationRes,
    AxiosError,
    useAdminPolicyMutationDto
  >(
    (dto: useAdminPolicyMutationDto) =>
      axios
        .patch<useAdminPolicyUpdateMutationRes>(`/admin/policy/${id}`, dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminPolicyList', { refetchInactive: true });
        queryClient.invalidateQueries(['AdminPolicy', id]);
      },
    },
  );
};

// 삭제 뮤테이션 훅
export type useAdminPolicyDeleteMutationRes = boolean;

export const useAdminPolicyDeleteMutation = (
  id: number,
): UseMutationResult<useAdminPolicyDeleteMutationRes, AxiosError, void> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminPolicyDeleteMutationRes, AxiosError>(
    () =>
      axios
        .delete<useAdminPolicyDeleteMutationRes>(`/admin/policy/${id}`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminPolicyList', { refetchInactive: true });
        queryClient.removeQueries(['AdminPolicy', id]);
      },
    },
  );
};

// 생성 뮤테이션 훅
export type useAdminPolicyCreateMutationRes = Policy;

export const useAdminPolicyCreateMutation = (): UseMutationResult<
  useAdminPolicyCreateMutationRes,
  AxiosError,
  CreatePolicyDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminPolicyCreateMutationRes, AxiosError, CreatePolicyDto>(
    (dto: CreatePolicyDto) =>
      axios
        .post<useAdminPolicyCreateMutationRes>(`/admin/policy`, dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminPolicyList', { refetchInactive: true });
      },
    },
  );
};
