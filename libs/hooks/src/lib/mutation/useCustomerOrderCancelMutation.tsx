import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, UseMutationOptions } from 'react-query';
import axios from '../../axios';

export type useCustomerOrderCancelMutationDto = CreateOrderCancellationDto;

export const useCustomerOrderCancelMutation = (
  options?: UseMutationOptions<
    CreateOrderCancellationRes,
    AxiosError,
    useCustomerOrderCancelMutationDto
  >,
): UseMutationResult<
  CreateOrderCancellationRes,
  AxiosError,
  useCustomerOrderCancelMutationDto
> => {
  return useMutation<
    CreateOrderCancellationRes,
    AxiosError,
    useCustomerOrderCancelMutationDto
  >(
    (dto: useCustomerOrderCancelMutationDto) =>
      axios
        .post<CreateOrderCancellationRes>('order/cancellation', dto)
        .then((res) => res.data),
    options,
  );
};
