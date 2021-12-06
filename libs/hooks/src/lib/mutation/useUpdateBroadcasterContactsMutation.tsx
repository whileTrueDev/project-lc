import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import { BroadcasterContactDto } from '@project-lc/shared-types';
import { BroadcasterContacts } from '.prisma/client';
import axios from '../../axios';

export type useUpdateBroadcasterContactsMutationRes = boolean;

export const useUpdateBroadcasterContactsMutation = (
  contactId: BroadcasterContacts['id'],
): UseMutationResult<boolean, AxiosError, BroadcasterContactDto> => {
  const queryClient = useQueryClient();
  return useMutation(
    (dto: BroadcasterContactDto) =>
      axios
        .put<useUpdateBroadcasterContactsMutationRes>(
          `/broadcaster/contacts/${contactId}`,
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('BroadcasterContacts');
      },
    },
  );
};
