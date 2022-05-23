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
/** 배송지 목록 조회 */
export const useCustomerAddress = (
  customerId?: number,
): UseQueryResult<CustomerAddress[], AxiosError> => {
  return useQuery<CustomerAddress[], AxiosError>(
    ['CustomerAddress', customerId],
    () => getCustomerAddress(customerId),
    { enabled: !!customerId },
  );
};

export const getDefaultCustomerAddress = async (
  customerId?: number,
): Promise<CustomerAddress> => {
  return axios
    .get<CustomerAddress>(`/customer/${customerId}/address/default`)
    .then((res) => res.data);
};
/** 기본 배송지 조회 */
export const useDefaultCustomerAddress = (
  customerId?: number,
): UseQueryResult<CustomerAddress, AxiosError> => {
  return useQuery<CustomerAddress, AxiosError>(
    ['DefaultCustomerAddress', customerId],
    () => getDefaultCustomerAddress(customerId),
    { enabled: !!customerId },
  );
};
