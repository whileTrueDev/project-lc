import { FindFmOrderDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminFmOrderByGoods = FindFmOrderDetailRes;

export const getAdminFmOrderByGoods = async ({
  orderId,
  sellerEmail,
}: {
  orderId: string;
  sellerEmail: string;
}): Promise<AdminFmOrderByGoods> => {
  return axios
    .get<AdminFmOrderByGoods>(`/fm-orders/admin/${orderId}`, { params: { sellerEmail } })
    .then((res) => res.data);
};

/** 관리자페이지에서 결제취소 요청에 대한 주문정보 조회 쿼리 */
export const useAdminFmOrderByGoods = ({
  orderId,
  sellerEmail,
}: {
  orderId: string;
  sellerEmail: string;
}): UseQueryResult<AdminFmOrderByGoods, AxiosError> => {
  return useQuery<AdminFmOrderByGoods, AxiosError>(
    ['AdminFmOrderByGoods', orderId],
    () => getAdminFmOrderByGoods({ orderId, sellerEmail }),
    {
      enabled: !!orderId && !!sellerEmail,
    },
  );
};
