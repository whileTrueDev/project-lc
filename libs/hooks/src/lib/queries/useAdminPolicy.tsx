import { Policy } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 관리자페이지에서 정책목록 조회(전체조회) */
export type AdminPolicyListRes = Omit<Policy, 'content'>[];
export const getAdminPolicyList = async (): Promise<AdminPolicyListRes> => {
  return axios.get<AdminPolicyListRes>('/admin/policy/list').then((res) => res.data);
};

export const useAdminPolicyList = (): UseQueryResult<AdminPolicyListRes, AxiosError> => {
  return useQuery<AdminPolicyListRes, AxiosError>('AdminPolicyList', getAdminPolicyList);
};

/** 관리자페이지에서 개별 정책 조회 */
export const getAdminPolicy = async (id: number): Promise<Policy> => {
  return axios.get<Policy>('/admin/policy', { params: { id } }).then((res) => res.data);
};

export const useAdminPolicy = (id: number): UseQueryResult<Policy, AxiosError> => {
  return useQuery<Policy, AxiosError>(['AdminPolicy', id], () => getAdminPolicy(id), {
    enabled: !!id,
  });
};
