import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import { BroadcasterContacts } from '.prisma/client';
import axios from '../../axios';

export const useDeleteBroadcasterContactsMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, number>(
    (contactId: BroadcasterContacts['id']) =>
      axios.delete<boolean>(`/broadcaster/contacts/${contactId}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('BroadcasterContacts');
      },
    },
  );
};
