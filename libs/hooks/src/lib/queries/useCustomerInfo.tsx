import { Customer } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerInfo = async (id?: number): Promise<Customer> => {
  return axios.get<Customer>(`/customer/${id}`).then((res) => res.data);
};

export const useCustomerInfo = (id?: number): UseQueryResult<Customer, AxiosError> => {
  return useQuery<Customer, AxiosError>(['CustomerInfo', id], () => getCustomerInfo(id), {
    enabled: !!id,
  });
};
