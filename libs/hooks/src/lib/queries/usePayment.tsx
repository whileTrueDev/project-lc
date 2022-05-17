import { Payment } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getPaymentByOrderId = async (orderId: string): Promise<Payment> => {
  return axios.get<Payment>(`/payment/${orderId}`).then((res) => res.data);
};

export const usePaymentByOrderId = (
  orderId: string,
): UseQueryResult<Payment, AxiosError> => {
  return useQuery<Payment, AxiosError>(
    'getPaymentByOrderId',
    () => getPaymentByOrderId(orderId),
    { enabled: !!orderId },
  );
};
