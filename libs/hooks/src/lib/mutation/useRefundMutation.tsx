import { CreateRefundRes, CreateRefundDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useRefundMutationRes = CreateRefundRes;

/** 환불데이터 생성 뮤테이션 */
export const useCreateRefundMutation = (): UseMutationResult<
  useRefundMutationRes,
  AxiosError,
  CreateRefundDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useRefundMutationRes, AxiosError, CreateRefundDto>(
    (dto: CreateRefundDto) =>
      axios.post<useRefundMutationRes>('/refund', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries('');
      },
    },
  );
};
