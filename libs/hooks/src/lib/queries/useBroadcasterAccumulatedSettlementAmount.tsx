import { Broadcaster } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterAccumulatedSettlementAmount = async (
  broadcasterId?: Broadcaster['id'],
): Promise<number> => {
  if (!broadcasterId) return 0;
  return axios
    .get<number>(`/broadcaster/${broadcasterId}/accumulated-settlement-amount`)
    .then((res) => res.data);
};

export const useBroadcasterAccumulatedSettlementAmount = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<number, AxiosError> => {
  return useQuery<number, AxiosError>(
    ['BroadcasterAccumulatedSettlementAmount', broadcasterId],
    () => getBroadcasterAccumulatedSettlementAmount(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
