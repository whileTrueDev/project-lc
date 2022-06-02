import { Broadcaster } from '@prisma/client';
import {
  BroadcasterPurchasesRes,
  FindBroadcasterPurchaseDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterPurchases = async (
  broadcasterId?: Broadcaster['id'],
  dto?: FindBroadcasterPurchaseDto,
): Promise<BroadcasterPurchasesRes> => {
  if (!broadcasterId) return [];
  return axios
    .get<BroadcasterPurchasesRes>(`/broadcaster/${broadcasterId}/purchases`, {
      params: dto,
    })
    .then((res) => res.data);
};

export const useBroadcasterPurchases = (
  broadcasterId?: Broadcaster['id'],
): UseQueryResult<BroadcasterPurchasesRes, AxiosError> => {
  return useQuery<BroadcasterPurchasesRes, AxiosError>(
    ['BroadcasterPurchases', broadcasterId],
    () => getBroadcasterPurchases(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
