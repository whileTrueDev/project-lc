import { SellerOrderCancelRequestDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useSellerOrderCancelMutationDto = SellerOrderCancelRequestDto;
export type useSellerOrderCancelMutationRes = any;

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
