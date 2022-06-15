import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { CreatePaymentRes, PaymentRequestDto } from '@project-lc/shared-types';
import axios from '../../axios';

export const usePaymentMutation = (): UseMutationResult<
  CreatePaymentRes,
  AxiosError,
  PaymentRequestDto
> => {
  return useMutation(
    (dto) => {
      return axios.post('/payment/success', dto).then((res) => {
        return res.data;
      });
    },
    // { retry: false },
  );
};
