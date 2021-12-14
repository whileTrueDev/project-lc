import { BroadcasterSettlementInfoRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBroadcasterSettlementInfo = async (
  broadcasterId?: number,
): Promise<BroadcasterSettlementInfoRes> => {
  return axios
    .get<BroadcasterSettlementInfoRes>(`/broadcaster/settlement-info/${broadcasterId}`)
    .then((res) => res.data);
};

export const useBroadcasterSettlementInfo = (
  broadcasterId?: number,
): UseQueryResult<BroadcasterSettlementInfoRes, AxiosError> => {
  return useQuery<BroadcasterSettlementInfoRes, AxiosError>(
    ['BroadcasterSettlementInfo', broadcasterId],
    () => getBroadcasterSettlementInfo(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
