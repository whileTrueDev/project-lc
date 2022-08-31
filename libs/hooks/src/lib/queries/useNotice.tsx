// 등록된 계좌 리스트
// 등록된 사업자 등록증 리스트
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { Notice } from '@prisma/client';

import axios from '../../axios';

export function getNotice(): Promise<Notice[]> {
  return axios
    .get<Notice[]>('/notice', { params: { target: process.env.NEXT_PUBLIC_APP_TYPE } })
    .then((res) => res.data);
}

export function getAdminNotice(): Promise<Notice[]> {
  return axios.get<Notice[]>('/notice/admin').then((res) => res.data);
}

export function useNoticeInfo(
  options?: UseQueryOptions<Notice[], AxiosError>,
  type?: 'admin' | undefined,
): UseQueryResult<Notice[], AxiosError> {
  const fetchFunction = type === 'admin' ? getAdminNotice : getNotice;
  return useQuery<Notice[], AxiosError>('Notice', fetchFunction, {
    ...options,
  });
}
