import { Broadcaster } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterReceivableSettlementAmount = async (
  broadcasterId?: Broadcaster['id'],
): Promise<number | null> => {
  if (!broadcasterId) return null;
  return axios
    .get<number | null>(`/broadcaster/${broadcasterId}/settlement/receivable-amount`)
    .then((res) => res.data);
};

export const useBroadcasterReceivableSettlementAmount = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<number | null, AxiosError> => {
  return useQuery<number | null, AxiosError>(
    ['BroadcasterReceivableSettlementAmount', broadcasterId],
    () => getBroadcasterReceivableSettlementAmount(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
