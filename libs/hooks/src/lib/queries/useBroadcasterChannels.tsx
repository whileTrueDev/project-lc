import { BroadcasterChannel } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterChannels = async (
  broadcasterId: number,
): Promise<BroadcasterChannel[]> => {
  return axios
    .get<BroadcasterChannel[]>(`/broadcaster/${broadcasterId}/channel-list`)
    .then((res) => res.data);
};

export const useBroadcasterChannels = (
  broadcasterId: number,
): UseQueryResult<BroadcasterChannel[], AxiosError> => {
  return useQuery<BroadcasterChannel[], AxiosError>(
    ['BroadcasterChannels', broadcasterId],
    () => getBroadcasterChannels(broadcasterId),
    {
      enabled: !!broadcasterId,
    },
  );
};
