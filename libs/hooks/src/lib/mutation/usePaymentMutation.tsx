import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export const usePaymentMutation = (): UseMutationResult<any, AxiosError, any> => {
  return useMutation((dto) => {
    return axios.post('/payment/success', dto).then((res) => {
      console.log(res.data);
      return res.data;
    });
  });
};
