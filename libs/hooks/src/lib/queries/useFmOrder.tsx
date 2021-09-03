import { useQuery } from 'react-query';
import { FindFmOrderDetailRes, FmOrder } from '@project-lc/shared-types';
import axios from '../../axios';

export const getFmOrder = async (
  orderId?: FmOrder['order_seq'],
): Promise<FindFmOrderDetailRes> => {
  return axios.get<FindFmOrderDetailRes>(`/fm-orders/${orderId}`).then((res) => res.data);
};

export const useFmOrder = (
  orderId?: FmOrder['order_seq'],
  initialData?: FindFmOrderDetailRes,
) => {
  return useQuery<FindFmOrderDetailRes>(['FmOrder', orderId], () => getFmOrder(orderId), {
    initialData,
    enabled: !!orderId,
    retry: false,
  });
};
