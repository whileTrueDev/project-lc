import { SellerOrderCancelRequest } from '@prisma/client';
import { SellerOrderCancelRequestDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useSellerOrderCancelMutationDto = SellerOrderCancelRequestDto;
export type useSellerOrderCancelMutationRes = SellerOrderCancelRequest;

/** 결제취소 요청 생성 뮤테이션 */
export const useSellerOrderCancelMutation = (): UseMutationResult<
  useSellerOrderCancelMutationRes,
  AxiosError,
  useSellerOrderCancelMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useSellerOrderCancelMutationRes,
    AxiosError,
    useSellerOrderCancelMutationDto
  >(
    (dto: useSellerOrderCancelMutationDto) =>
      axios
        .post<useSellerOrderCancelMutationRes>('/order-cancel', dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['SellerOrderCancelRequest', data.orderSeq], {
          exact: true,
        });
      },
    },
  );
};

export type OrderCancelDoneFlagMutationDto = { requestId: number; doneFlag: boolean };
/** 결제취소 요청 상태 변경 뮤테이션 */
export const useSellerOrderCancelDoneFlagMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  OrderCancelDoneFlagMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, OrderCancelDoneFlagMutationDto>(
    (dto: OrderCancelDoneFlagMutationDto) =>
      axios
        .put<boolean>(`/admin/order-cancel/${dto.requestId}`, { doneFlag: dto.doneFlag })
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminOrderCancelRequest', {
          refetchInactive: true,
        });
      },
    },
  );
};
