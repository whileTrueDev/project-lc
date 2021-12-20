import { Broadcaster } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { BroadcasterSettlementReceivableAmountRes } from '@project-lc/shared-types';
import axios from '../../axios';

export const getBroadcasterReceivableSettlementAmount = async (
  broadcasterId?: Broadcaster['id'],
): Promise<BroadcasterSettlementReceivableAmountRes | null> => {
  if (!broadcasterId) return null;
  return axios
    .get<BroadcasterSettlementReceivableAmountRes | null>(
      `/fm-settlements/broadcaster/${broadcasterId}/receivable-amount`,
    )
    .then((res) => res.data);
};

export const useBroadcasterReceivableSettlementAmount = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<BroadcasterSettlementReceivableAmountRes | null, AxiosError> => {
  return useQuery<BroadcasterSettlementReceivableAmountRes | null, AxiosError>(
    ['BroadcasterReceivableSettlementAmount', broadcasterId],
    () => getBroadcasterReceivableSettlementAmount(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
