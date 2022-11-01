import { AxiosError } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import axios from '../../axios';
import { INFINITE_ORDER_LIST_QUERY_KEY } from '../queries/useOrderList';

export interface useOrderPurchaseConfirmMutationDto {
  orderItemOptionId: number;
}
export const useOrderPurchaseConfirmMutation = (
  options?: UseMutationOptions<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>,
): UseMutationResult<boolean, AxiosError, useOrderPurchaseConfirmMutationDto> => {
  const queryClient = useQueryClient();
  const appType = process.env.NEXT_PUBLIC_APP_TYPE;
  /** 크크쇼에서 요청시 구매확정주체 = 소비자
   * 다른데(관리자)서 요청시 구매확정주체를 Undefined로 넘김 => 구매확정주체 관리자로 처리됨
   *
   *  구매확정주체가 Undefined로 들어가면 Post /order/purchase-confirm 의 @Body validation 과정에서
   * OrderPurchaseConfirmationDto.buyConfirmSubject의 기본값인 admin이 저장됨
   */
  const confirmSubject = appType === 'customer' ? 'customer' : undefined;
  return useMutation<boolean, AxiosError, useOrderPurchaseConfirmMutationDto>(
    (dto: useOrderPurchaseConfirmMutationDto) =>
      axios
        .post<boolean>(`order/purchase-confirm`, {
          ...dto,
          buyConfirmSubject: confirmSubject,
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(INFINITE_ORDER_LIST_QUERY_KEY);
        queryClient.invalidateQueries('OrderDetail');
        queryClient.invalidateQueries('getAdminOrder', { refetchInactive: true });
        queryClient.invalidateQueries('Exports');
        queryClient.invalidateQueries(['Exports'], { refetchInactive: true });
        queryClient.invalidateQueries('AdminOrderList');
        queryClient.invalidateQueries('CustomerMileage', { refetchInactive: true });
        queryClient.invalidateQueries('CustomerMileageHistory', {
          refetchInactive: true,
        });
      },
      ...options,
    },
  );
};
