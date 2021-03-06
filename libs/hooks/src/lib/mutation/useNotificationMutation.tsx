import { MarkNotificationReadStateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useNotificationMutationRes = boolean;

export const useNotificationMutation = (): UseMutationResult<
  useNotificationMutationRes,
  AxiosError,
  MarkNotificationReadStateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useNotificationMutationRes,
    AxiosError,
    MarkNotificationReadStateDto
  >(
    (dto: MarkNotificationReadStateDto) =>
      axios
        .patch<useNotificationMutationRes>('/notification', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Notifications');
      },
    },
  );
};

type MarkAllNotificationReadStateDto = Pick<
  MarkNotificationReadStateDto,
  'userEmail' | 'userType'
>;

export const useAllNotificationReadMutation = (): UseMutationResult<
  useNotificationMutationRes,
  AxiosError,
  MarkAllNotificationReadStateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useNotificationMutationRes,
    AxiosError,
    MarkAllNotificationReadStateDto
  >(
    (dto: MarkAllNotificationReadStateDto) =>
      axios
        .patch<useNotificationMutationRes>('/notification/all', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('Notifications');
      },
    },
  );
};
