import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDeleteRes,
  ExchangeUpdateRes,
  UpdateExchangeDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';
import { CUSTOMER_EXCHANGE_LIST_QUERY_KEY } from '../queries/useExchange';
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
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
        queryClient.invalidateQueries(CUSTOMER_EXCHANGE_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
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
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
        queryClient.invalidateQueries(CUSTOMER_EXCHANGE_LIST_QUERY_KEY, {
          refetchInactive: true,
        });
      },
    },
  );
};

export type ExchangeMutationDto = {
  exchangeId: number;
  dto: UpdateExchangeDto;
};

/** 교환요청 상태 수정 훅 */
export const useUpdateExchangeMutation = (): UseMutationResult<
  ExchangeUpdateRes,
  AxiosError,
  ExchangeMutationDto
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ exchangeId, dto }: ExchangeMutationDto) => {
      return axios.patch(`/exchange/${exchangeId}`, dto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('OrderDetail');
      },
    },
  );
};
