import { BroadcasterSettlementTargetRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBcSettlementTargets =
  async (): Promise<BroadcasterSettlementTargetRes> => {
    return axios
      .get<BroadcasterSettlementTargetRes>('/fm-settlements/broadcaster/targets')
      .then((res) => res.data);
  };

export const useBcSettlementTargets = (): UseQueryResult<
  BroadcasterSettlementTargetRes,
  AxiosError
> => {
  return useQuery<BroadcasterSettlementTargetRes, AxiosError>(
    'BcSettlementTargets',
    getBcSettlementTargets,
  );
};
