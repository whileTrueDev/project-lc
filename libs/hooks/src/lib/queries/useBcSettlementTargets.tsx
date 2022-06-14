import { BroadcasterSettlementTargets } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getBcSettlementTargets = async (): Promise<BroadcasterSettlementTargets> => {
  return axios
    .get<BroadcasterSettlementTargets>('/admin/settlement/broadcaster/targets')
    .then((res) => res.data);
};

export const useBcSettlementTargets = (): UseQueryResult<
  BroadcasterSettlementTargets,
  AxiosError
> => {
  return useQuery<BroadcasterSettlementTargets, AxiosError>(
    'BcSettlementTargets',
    getBcSettlementTargets,
  );
};
