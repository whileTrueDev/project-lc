import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type SellerOrderCancelRequestRes = any;

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
