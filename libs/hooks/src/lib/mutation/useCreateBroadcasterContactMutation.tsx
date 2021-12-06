import { BroadcasterContactDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { BroadcasterContacts } from '.prisma/client';
import axios from '../../axios';

export type useCreateBroadcasterContactMutationRes = BroadcasterContacts;

export const useCreateBroadcasterContactMutation = (): UseMutationResult<
  useCreateBroadcasterContactMutationRes,
  AxiosError,
  BroadcasterContactDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCreateBroadcasterContactMutationRes,
    AxiosError,
    BroadcasterContactDto
  >(
    (dto: BroadcasterContactDto) =>
      axios
        .post<useCreateBroadcasterContactMutationRes>('/broadcaster/contacts', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('BroadcasterContacts');
      },
    },
  );
};
