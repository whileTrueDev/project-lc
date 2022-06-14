import { CustomerMileageLog } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerMileageHistory = async (): Promise<CustomerMileageLog[]> => {
  return axios.get<CustomerMileageLog[]>('/mileage/history').then((res) => res.data);
};

export const useCustomerMileageHistory = (): UseQueryResult<
  CustomerMileageLog[],
  AxiosError
> => {
  return useQuery<CustomerMileageLog[], AxiosError>(
    'CustomerMileageHistory',
    getCustomerMileageHistory,
  );
};
