import { Broadcaster } from '@prisma/client';
import { FindBcSettlementHistoriesRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterSettlementHistory = async (
  broadcasterId?: Broadcaster['id'],
): Promise<FindBcSettlementHistoriesRes> => {
  return axios
    .get<FindBcSettlementHistoriesRes>(`/broadcaster/settlement-history/${broadcasterId}`)
    .then((res) => res.data);
};

export const useBroadcasterSettlementHistory = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<FindBcSettlementHistoriesRes, AxiosError> => {
  return useQuery<FindBcSettlementHistoriesRes, AxiosError>(
    ['BroadcasterSettlementHistory', broadcasterId],
    () => getBroadcasterSettlementHistory(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
