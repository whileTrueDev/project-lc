import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminFmOrderByGoods = FindFmOrderDetailRes;

export const getAdminFmOrderByGoods = async ({
  orderId,
  sellerId,
}: {
  orderId: string;
  sellerId: number;
}): Promise<AdminFmOrderByGoods> => {
  return axios
    .get<AdminFmOrderByGoods>(`/fm-orders/admin/${orderId}`, { params: { sellerId } })
    .then((res) => res.data);
};

/** 관리자페이지에서 결제취소 요청에 대한 주문정보 조회 쿼리 */
export const useAdminFmOrderByGoods = ({
  orderId,
  sellerId,
}: {
  orderId: string;
  sellerId: number;
}): UseQueryResult<AdminFmOrderByGoods, AxiosError> => {
  return useQuery<AdminFmOrderByGoods, AxiosError>(
    ['AdminFmOrderByGoods', orderId],
    () => getAdminFmOrderByGoods({ orderId, sellerId }),
    {
      enabled: !!orderId && !!sellerId,
    },
  );
};
