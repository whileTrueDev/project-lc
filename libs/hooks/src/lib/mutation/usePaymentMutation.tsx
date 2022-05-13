import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { Payment } from '@project-lc/shared-types';
import axios from '../../axios';

export const usePaymentMutation = (): UseMutationResult<Payment, AxiosError, any> => {
  return useMutation((dto) => {
    return axios.post('/payment/success', dto).then((res) => {
      return res.data;
    });
  });
};
