import { OrderShippingCheckDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 배송비정보 타입 */
export type OrderShippingData = Record<
  number, // 배송비그룹 id
  {
    isShippingAvailable?: boolean;
    cost: { std: number; add: number } | null; // 기본배송비, 추가배송비
    items: number[]; // 해당배송비에 포함된 goodsId[]
  }
>;

export type useOrderShippingCheckRes = OrderShippingData;

export const useOrderShippingCheck = (): UseMutationResult<
  useOrderShippingCheckRes,
  AxiosError,
  OrderShippingCheckDto
> => {
  // const queryClient = useQueryClient();
  return useMutation<useOrderShippingCheckRes, AxiosError, OrderShippingCheckDto>(
    (dto: OrderShippingCheckDto) =>
      axios
        .post<useOrderShippingCheckRes>('/order/shipping/check', dto)
        .then((res) => res.data),
    {
      // onSuccess: (data) => {
      //   queryClient.invalidateQueries('');
      // },
    },
  );
};
