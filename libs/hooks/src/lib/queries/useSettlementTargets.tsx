import { FmSettlementTargets } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type SettlementTargets = Array<FmSettlementTargets>;

export const getSettlementTargets = async (): Promise<SettlementTargets> => {
  return axios.get<SettlementTargets>('/fm-settlements/targets').then((res) => res.data);
};

export const useSettlementTargets = (
  initialData?: SettlementTargets,
): UseQueryResult<SettlementTargets, AxiosError> => {
  return useQuery<SettlementTargets, AxiosError>(
    'SettlementTargets',
    getSettlementTargets,
    { initialData },
  );
};
