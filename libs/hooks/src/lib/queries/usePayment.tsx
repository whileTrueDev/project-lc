import { Payment } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getPaymentByOrderCode = async (orderCode: string): Promise<Payment> => {
  return axios.get<Payment>(`/payment/${orderCode}`).then((res) => res.data);
};

export const usePaymentByOrderCode = (
  orderCode: string,
): UseQueryResult<Payment, AxiosError> => {
  return useQuery<Payment, AxiosError>(
    ['getPaymentByOrderCode', { orderCode }],
    () => getPaymentByOrderCode(orderCode),
    { enabled: !!orderCode },
  );
};
