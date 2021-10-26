import { OrderCancelRequestDetailRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 특정 주문에 대한 결제취소 요청 정보 조회 */
export type SellerOrderCancelRequestRes = OrderCancelRequestDetailRes;

export const getSellerOrderCancelRequest = async (
  orderSeq: string | number,
): Promise<SellerOrderCancelRequestRes> => {
  return axios
    .get<SellerOrderCancelRequestRes>(`/order-cancel/${orderSeq}`)
    .then((res) => res.data);
};

export const useSellerOrderCancelRequest = (
  orderSeq: string | number,
): UseQueryResult<SellerOrderCancelRequestRes, AxiosError> => {
  return useQuery(['SellerOrderCancelRequest', orderSeq], () =>
    getSellerOrderCancelRequest(orderSeq),
  );
};
