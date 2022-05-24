import { GoodsCategoryRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminMileageList = async (): Promise<GoodsCategoryRes> => {
  return axios.get<GoodsCategoryRes>('/admin/goods-category').then((res) => res.data);
};

export const useAdminMileageList = (): UseQueryResult<GoodsCategoryRes, AxiosError> => {
  return useQuery<GoodsCategoryRes, AxiosError>('AdminMileage', getAdminMileageList);
};
