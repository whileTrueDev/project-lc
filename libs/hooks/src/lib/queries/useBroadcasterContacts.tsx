import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { Broadcaster, BroadcasterContacts } from '.prisma/client';
import axios from '../../axios';

export const getBroadcasterContacts = async (
  broadcasterId: Broadcaster['id'],
): Promise<BroadcasterContacts[]> => {
  return axios
    .get<BroadcasterContacts[]>(`/broadcaster/contacts/${broadcasterId}`)
    .then((res) => res.data);
};

export const useBroadcasterContacts = (
  broadcasterId: Broadcaster['id'],
): UseQueryResult<BroadcasterContacts[], AxiosError> => {
  return useQuery<BroadcasterContacts[], AxiosError>(
    ['BroadcasterContacts', broadcasterId],
    () => getBroadcasterContacts(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
