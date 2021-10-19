// 등록된 계좌 리스트
// 등록된 사업자 등록증 리스트
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Notice } from '@prisma/client';

import axios from '../../axios';

export function getNotice(): Promise<Notice[]> {
  return axios.get<Notice[]>('/notice').then((res) => res.data);
}

export function useNoticeInfo(
  options?: UseQueryOptions<Notice[], AxiosError>,
): UseQueryResult<Notice[], AxiosError> {
  return useQuery<Notice[], AxiosError>('Notice', getNotice, {
    ...options,
  });
}
