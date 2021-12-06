import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import { BroadcasterContacts } from '.prisma/client';
import { BroadcasterContactDto } from '../../../../shared-types/src';
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
