import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export function getSettlementInfo() {
  return axios.get<any>('/seller/settlement').then((res) => res.data);
}

export function useSettlementInfo(options?: UseQueryOptions<any>) {
  return useQuery<any>('SettlementInfo', getSettlementInfo, {
    ...options,
  });
}
