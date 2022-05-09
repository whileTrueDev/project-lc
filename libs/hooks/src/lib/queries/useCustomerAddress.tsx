import { CustomerAddress } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
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
    ['CustomerAddresses', customerId],
    () => getCustomerAddress(customerId),
    { enabled: !!customerId },
  );
};
