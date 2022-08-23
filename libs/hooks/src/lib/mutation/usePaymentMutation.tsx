import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { CreatePaymentRes, PaymentRequestDto } from '@project-lc/shared-types';
import axios from '../../axios';
import { OrderCreateDataType } from './useOrderMutation';

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

// 결제요청 & 주문생성에 필요한 dto
export type PaymentCreateMutationDto = {
  payment: PaymentRequestDto;
} & OrderCreateDataType;

export const usePaymentMutationTemp = (): UseMutationResult<
  any, // TODO : orderId 는 리턴해야함
  AxiosError,
  PaymentCreateMutationDto
> => {
  return useMutation(
    (dto) => {
      return axios.post('/payment/success/temp', dto).then((res) => {
        return res.data;
      });
    },
    // { retry: false },
  );
};
