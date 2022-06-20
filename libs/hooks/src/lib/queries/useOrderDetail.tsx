import {
  GetNonMemberOrderDetailDto,
  GetOneOrderDetailDto,
  GetOrderDetailsForSpreadsheetDto,
  NonMemberOrderDetailRes,
  OrderDetailRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 개별 주문 상세조회 요청 */
export const getOrderDetail = async (
  dto: GetOneOrderDetailDto,
): Promise<OrderDetailRes> => {
  return axios
    .get<OrderDetailRes>(`/order/detail`, { params: dto })
    .then((res) => res.data);
};
/** 개별 주문 상세조회 훅 */
export const useOrderDetail = (
  dto: GetOneOrderDetailDto,
): UseQueryResult<OrderDetailRes, AxiosError> => {
  return useQuery<OrderDetailRes, AxiosError>(
    ['OrderDetail', dto],
    () => getOrderDetail(dto),
    {
      enabled: !!dto.orderId || !!dto.orderCode,
    },
  );
};

/** 내보내기 - 여러주문 상세조회 요청 */
export const getOrderDetailsForSpreadsheet = async (
  dto: GetOrderDetailsForSpreadsheetDto,
): Promise<OrderDetailRes[]> => {
  return axios
    .get<OrderDetailRes[]>(`/order/details`, { params: dto })
    .then((res) => res.data);
};
/** 내보내기 - 여러주문 상세조회 훅 */
export const useOrderDetailsForSpreadsheet = (
  dto: GetOrderDetailsForSpreadsheetDto,
): UseQueryResult<OrderDetailRes[], AxiosError> => {
  return useQuery<OrderDetailRes[], AxiosError>(
    ['OrderDetailList', dto],
    () => getOrderDetailsForSpreadsheet(dto),
    { enabled: !!dto.orderIds.length },
  );
};

/** 비회원 주문조회 */
export const getNonmemberOrderDetail = async (
  dto: GetNonMemberOrderDetailDto,
): Promise<NonMemberOrderDetailRes> => {
  return axios
    .get<NonMemberOrderDetailRes>(`/order/nonmember`, { params: dto })
    .then((res) => res.data);
};

export const useNonmemberOrderDetail = (
  dto: GetNonMemberOrderDetailDto,
): UseQueryResult<NonMemberOrderDetailRes, AxiosError> => {
  return useQuery<NonMemberOrderDetailRes, AxiosError>(
    ['NonmemberOrderDetail', dto],
    () => getNonmemberOrderDetail(dto),
    { enabled: !!dto.orderCode && !!dto.ordererName },
  );
};
