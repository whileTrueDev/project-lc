import { Policy } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminPolicyList = Omit<Policy, 'content'>[];
export const getAdminPolicy = async (): Promise<AdminPolicyList> => {
  return axios.get<AdminPolicyList>('/admin/policy/list').then((res) => res.data);
};

export const useAdminPolicy = (): UseQueryResult<AdminPolicyList, AxiosError> => {
  return useQuery<AdminPolicyList, AxiosError>('AdminPolicyList', getAdminPolicy);
};
