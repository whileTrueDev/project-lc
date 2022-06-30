import { AdminReturnRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminReturnList = AdminReturnRes;

export const getAdminReturnList = async (): Promise<AdminReturnList> => {
  return axios.get<AdminReturnList>('/admin/returns').then((res) => res.data);
};

export const useAdminReturnList = (): UseQueryResult<AdminReturnList, AxiosError> => {
  return useQuery<AdminReturnList, AxiosError>('AdminReturnList', getAdminReturnList);
};
