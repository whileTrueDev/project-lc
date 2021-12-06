import { ChangeNicknameDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Broadcaster } from '.prisma/client';
import axios from '../../axios';

export type useUpdateNicknameMutationRes = Broadcaster;

export const useUpdateNicknameMutation = (): UseMutationResult<
  useUpdateNicknameMutationRes,
  AxiosError,
  ChangeNicknameDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useUpdateNicknameMutationRes, AxiosError, ChangeNicknameDto>(
    (dto: ChangeNicknameDto) =>
      axios
        .put<useUpdateNicknameMutationRes>('/broadcaster/nickname', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Broadcaster');
      },
    },
  );
};
