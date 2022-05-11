import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { CustomerAddress } from '@prisma/client';
import axios from '../../axios';

export const getCustomerAddress = async (
  customerId?: number,
): Promise<CustomerAddress[]> => {
  return axios
    .get<CustomerAddress[]>(`/customer/${customerId}/address`)
    .then((res) => res.data);
};

export const useCustomerAddress = (
  customerId?: number,
): UseQueryResult<CustomerAddress[], AxiosError> => {
  return useQuery<CustomerAddress[], AxiosError>(
    ['getCustomerAddress', customerId],
    () => getCustomerAddress(customerId),
    {
      enabled: !!customerId,
    },
  );
};

export const getDefaultCustomerAddress = async (
  customerId?: number,
): Promise<CustomerAddress> => {
  return axios
    .get<CustomerAddress>(`/customer/${customerId}/address/default`)
    .then((res) => res.data);
};

export const useDefaultCustomerAddress = (
  customerId?: number,
): UseQueryResult<CustomerAddress, AxiosError> => {
  return useQuery<CustomerAddress, AxiosError>(
    ['getDefaultCustomerAddress', customerId],
    () => getDefaultCustomerAddress(customerId),
    {
      enabled: !!customerId,
    },
  );
};
