import { Policy } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 관리자페이지에서 정책목록 조회(전체조회) */
export type AdminPolicyList = Omit<Policy, 'content'>[];
export const getAdminPolicyList = async (): Promise<AdminPolicyList> => {
  return axios.get<AdminPolicyList>('/admin/policy/list').then((res) => res.data);
};

export const useAdminPolicyList = (): UseQueryResult<AdminPolicyList, AxiosError> => {
  return useQuery<AdminPolicyList, AxiosError>('AdminPolicyList', getAdminPolicyList);
};

/** 관리자페이지에서 개별 정책 조회 */
// export const getAdminPolicy = async (): Promise<AdminPolicyList> => {
//   return axios.get<AdminPolicyList>('/admin/policy/list').then((res) => res.data);
// };

// export const useAdminPolicy = (): UseQueryResult<AdminPolicyList, AxiosError> => {
//   return useQuery<AdminPolicyList, AxiosError>('AdminPolicyList', getAdminPolicy);
// };
