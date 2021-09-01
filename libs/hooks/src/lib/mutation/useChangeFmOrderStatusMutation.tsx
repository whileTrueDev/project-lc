import { useMutation, useQueryClient } from 'react-query';
import { FmOrder, FmOrderStatus } from '@project-lc/shared-types';
import axios from '../../axios';

export interface useChangeFmOrderStatusMutationDto {
  orderId: FmOrder['order_seq'];
  targetStatus: FmOrderStatus['name'];
}
export type useChangeFmOrderStatusMutationRes = boolean;

export const changeFmOrderStatus = (dto: useChangeFmOrderStatusMutationDto) =>
  axios.put<useChangeFmOrderStatusMutationRes>(`/fm-orders/${dto.orderId}`, {
    targetStatus: dto.targetStatus,
  });

export const useChangeFmOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(changeFmOrderStatus, {
    onSuccess: ({ data }) => {
      if (data) queryClient.invalidateQueries(['FmOrder']);
    },
  });
};
