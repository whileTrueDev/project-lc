import { Notice } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useDeleteNoticeMutationRes = Notice;

export const useDeleteNoticeMutation = (): UseMutationResult<
  useDeleteNoticeMutationRes,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<useDeleteNoticeMutationRes, AxiosError, number>(
    (id: number) =>
      axios.delete<useDeleteNoticeMutationRes>(`/notice/${id}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Notice');
      },
    },
  );
};
