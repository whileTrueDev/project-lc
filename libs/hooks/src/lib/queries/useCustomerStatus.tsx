import { CustomerStatusRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerStatus = async (
  customerId?: number,
): Promise<CustomerStatusRes> => {
  return axios
    .get<CustomerStatusRes>('/customer/status', { params: { customerId } })
    .then((res) => res.data);
};

export const useCustomerStatus = (
  customerId?: number,
): UseQueryResult<CustomerStatusRes, AxiosError> => {
  return useQuery<CustomerStatusRes, AxiosError>(
    'CustomerStatus',
    () => getCustomerStatus(customerId),
    { enabled: !!customerId },
  );
};
