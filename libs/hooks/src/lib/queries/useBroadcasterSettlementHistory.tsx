import { Broadcaster } from '@prisma/client';
import { FindBCSettlementHistoriesRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterSettlementHistory = async (
  broadcasterId?: Broadcaster['id'],
): Promise<FindBCSettlementHistoriesRes> => {
  return axios
    .get<FindBCSettlementHistoriesRes>(`/broadcaster/settlement-history/${broadcasterId}`)
    .then((res) => res.data);
};

export const useBroadcasterSettlementHistory = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<FindBCSettlementHistoriesRes, AxiosError> => {
  return useQuery<FindBCSettlementHistoriesRes, AxiosError>(
    ['BroadcasterSettlementHistory', broadcasterId],
    () => getBroadcasterSettlementHistory(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
