import { CustomerMileage } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerMileage = async (): Promise<CustomerMileage> => {
  return axios.get<CustomerMileage>('/mileage').then((res) => res.data);
};

export const useCustomerMileage = (): UseQueryResult<CustomerMileage, AxiosError> => {
  return useQuery<CustomerMileage, AxiosError>('CustomerMileage', getCustomerMileage);
};
