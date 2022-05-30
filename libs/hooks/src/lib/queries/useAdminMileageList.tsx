import { CustomerMileage } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminMileageList = async (): Promise<CustomerMileage[]> => {
  return axios.get<CustomerMileage[]>('/admin/mileage').then((res) => res.data);
};

export const useAdminMileageList = (): UseQueryResult<CustomerMileage[], AxiosError> => {
  return useQuery<CustomerMileage[], AxiosError>('AdminMileage', getAdminMileageList);
};
