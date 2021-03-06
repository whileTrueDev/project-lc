// 등록된 계좌 리스트
// 등록된 사업자 등록증 리스트
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { AdminSettlementInfoType } from '@project-lc/shared-types';

import axios from '../../axios';

export function getAdminSettlementInfo(): Promise<AdminSettlementInfoType> {
  return axios.get<AdminSettlementInfoType>('/admin/settlement').then((res) => res.data);
}

export function useAdminSettlementInfo(
  options?: UseQueryOptions<AdminSettlementInfoType, AxiosError>,
): UseQueryResult<AdminSettlementInfoType, AxiosError> {
  return useQuery<AdminSettlementInfoType, AxiosError>(
    'Settlement',
    getAdminSettlementInfo,
    {
      ...options,
    },
  );
}
