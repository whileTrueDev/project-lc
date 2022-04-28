import { GoodsCategoryRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminCategory = async (): Promise<GoodsCategoryRes> => {
  return axios.get<GoodsCategoryRes>('/admin/goods-category').then((res) => res.data);
};

export const useAdminCategory = (): UseQueryResult<GoodsCategoryRes, AxiosError> => {
  return useQuery<GoodsCategoryRes, AxiosError>('AdminCategory', getAdminCategory);
};
