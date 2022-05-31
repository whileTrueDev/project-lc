import { GoodsCategoryRes } from '@project-lc/shared-types';
import { CustomerMileage, CustomerMileageLog, MileageSetting } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminMileageLogList = async (): Promise<CustomerMileageLog[]> => {
  return axios
    .get<CustomerMileageLog[]>('/admin/mileage/history')
    .then((res) => res.data);
};

export const useAdminMileageLogList = (): UseQueryResult<
  CustomerMileageLog[],
  AxiosError
> => {
  return useQuery<CustomerMileageLog[], AxiosError>(
    'AdminMileageLog',
    getAdminMileageLogList,
  );
};
