import { UpdateOrderDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 관리자 주문상태 수정 뮤테이션 훅 */
export const useAdminOrderPatchMutation = (
  orderId: number,
): UseMutationResult<boolean, AxiosError, UpdateOrderDto> => {
  const queryClient = useQueryClient();
  return useMutation<boolean, AxiosError, UpdateOrderDto>(
    (dto: UpdateOrderDto) =>
      axios.patch<boolean>(`/admin/order/${orderId}`, dto).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('getAdminOrder', {
          refetchInactive: true,
        });
        queryClient.invalidateQueries('AdminOrderList', { refetchInactive: true });
      },
    },
  );
};
