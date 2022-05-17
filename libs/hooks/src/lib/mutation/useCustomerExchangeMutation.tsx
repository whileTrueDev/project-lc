import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDeleteRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

/** 교환요청 생성 훅 */
export const useCustomerExchangeMutation = (): UseMutationResult<
  CreateExchangeRes,
  AxiosError,
  CreateExchangeDto
> => {
  const queryClient = useQueryClient();
  return useMutation<CreateExchangeRes, AxiosError, CreateExchangeDto>(
    (dto: CreateExchangeDto) =>
      axios.post<CreateExchangeRes>('/exchange', dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
      },
    },
  );
};

/** 교환요청 삭제 훅 */
export const useDeleteCustomerExchange = (): UseMutationResult<
  ExchangeDeleteRes,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<ExchangeDeleteRes, AxiosError, number>(
    (exchangeId: number) =>
      axios.delete<ExchangeDeleteRes>(`/exchange/${exchangeId}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
      },
    },
  );
};
