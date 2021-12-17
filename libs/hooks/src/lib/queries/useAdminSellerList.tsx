import { AdminSellerListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminSellerList = async (): Promise<AdminSellerListRes> => {
  return axios.get<AdminSellerListRes>('/admin/sellers').then((res) => res.data);
};

export const useAdminSellerList = (): UseQueryResult<AdminSellerListRes, AxiosError> => {
  return useQuery<AdminSellerListRes, AxiosError>('AdminSellerList', getAdminSellerList);
};
