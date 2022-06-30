import { AdminRefundRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminRefundList = async (): Promise<AdminRefundRes> => {
  return axios.get<AdminRefundRes>('/admin/refunds').then((res) => res.data);
};

export const useAdminRefundList = (): UseQueryResult<AdminRefundRes, AxiosError> => {
  return useQuery<AdminRefundRes, AxiosError>('AdminRefundList', getAdminRefundList);
};
