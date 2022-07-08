import { AdminGoodsCategoryRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminCategory = async (): Promise<AdminGoodsCategoryRes> => {
  return axios
    .get<AdminGoodsCategoryRes>('/admin/goods-category')
    .then((res) => res.data);
};

export const useAdminCategory = (): UseQueryResult<AdminGoodsCategoryRes, AxiosError> => {
  return useQuery<AdminGoodsCategoryRes, AxiosError>('AdminCategory', getAdminCategory);
};
