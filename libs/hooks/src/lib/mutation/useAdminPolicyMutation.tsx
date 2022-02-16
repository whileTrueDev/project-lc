import { Policy } from '@prisma/client';
import { UpdatePolicyDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

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
