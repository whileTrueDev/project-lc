import { LiveShoppingEmbed } from '@prisma/client';
import { CreateKkshowLiveEmbedDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminLiveEmbedMutationRes = LiveShoppingEmbed;

export const useAdminLiveEmbedMutation = (): UseMutationResult<
  useAdminLiveEmbedMutationRes,
  AxiosError,
  CreateKkshowLiveEmbedDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminLiveEmbedMutationRes, AxiosError, CreateKkshowLiveEmbedDto>(
    (dto: CreateKkshowLiveEmbedDto) =>
      axios
        .post<useAdminLiveEmbedMutationRes>('/admin/kkshow-live-embed', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('LiveEmbedList');
      },
    },
  );
};

export type useAdminLiveEmbedDeleteMutationRes = boolean;

export const useAdminLiveEmbedDeleteMutation = (): UseMutationResult<
  useAdminLiveEmbedDeleteMutationRes,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<useAdminLiveEmbedDeleteMutationRes, AxiosError, number>(
    (id: number) =>
      axios
        .delete<useAdminLiveEmbedDeleteMutationRes>(`/admin/kkshow-live-embed/${id}`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('LiveEmbedList');
      },
    },
  );
};
