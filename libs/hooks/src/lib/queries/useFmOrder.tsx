import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrderDetailRes, FmOrder } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrder = async (
  orderId?: FmOrder['order_seq'] | string,
): Promise<FindFmOrderDetailRes> => {
  return axios.get<FindFmOrderDetailRes>(`/fm-orders/${orderId}`).then((res) => res.data);
};

export const useFmOrder = (
  orderId?: FmOrder['order_seq'] | string,
  initialData?: FindFmOrderDetailRes,
): UseQueryResult<FindFmOrderDetailRes, AxiosError> => {
  return useQuery<FindFmOrderDetailRes, AxiosError>(
    ['FmOrder', orderId],
    () => getFmOrder(orderId),
    {
      initialData,
      enabled: !!orderId,
      retry: false,
    },
  );
};
