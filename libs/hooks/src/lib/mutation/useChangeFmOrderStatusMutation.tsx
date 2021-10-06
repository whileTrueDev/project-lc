import { FmOrder, FmOrderStatus } from '@project-lc/shared-types';
import { useFmOrderStore } from '@project-lc/stores';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios from '../../axios';

export interface useChangeFmOrderStatusMutationDto {
  orderId: FmOrder['order_seq'];
  targetStatus: FmOrderStatus['name'];
}
export type useChangeFmOrderStatusMutationRes = boolean;

export const changeFmOrderStatus = (
  dto: useChangeFmOrderStatusMutationDto,
): Promise<useChangeFmOrderStatusMutationRes> =>
  axios
    .put<useChangeFmOrderStatusMutationRes>(`/fm-orders/${dto.orderId}`, {
      targetStatus: dto.targetStatus,
    })
    .then((res) => res.data);

export const useChangeFmOrderStatusMutation = (): UseMutationResult<
  useChangeFmOrderStatusMutationRes,
  AxiosError,
  useChangeFmOrderStatusMutationDto
> => {
  const queryClient = useQueryClient();
  const { search, searchDateType, searchStartDate, searchEndDate, searchStatuses } =
    useFmOrderStore();

  return useMutation(changeFmOrderStatus, {
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries('FmOrder');
        queryClient.invalidateQueries(
          [
            'FmOrders',
            search,
            searchDateType,
            searchEndDate,
            searchStartDate,
            searchStatuses,
          ],
          { refetchInactive: true },
        );
      }
    },
  });
};
