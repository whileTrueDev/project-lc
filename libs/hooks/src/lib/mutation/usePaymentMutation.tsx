import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { PaymentRequestDto } from '@project-lc/shared-types';
import axios from '../../axios';
import { OrderCreateDataType } from './useOrderMutation';

// 결제요청 & 주문생성에 필요한 dto
export type PaymentCreateMutationDto = {
  payment: PaymentRequestDto;
} & OrderCreateDataType;

export const usePaymentMutation = (): UseMutationResult<
  { orderId: number },
  AxiosError,
  PaymentCreateMutationDto
> => {
  return useMutation((dto) => {
    return axios.post('/payment/success', dto).then((res) => {
      return res.data;
    });
  });
};
