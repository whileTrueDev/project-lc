import {
  GetOrderDetailsForSpreadsheetDto,
  OrderDetailRes,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 개별 주문 상세조회 요청 */
export const getOrderDetail = async (id?: number): Promise<OrderDetailRes> => {
  return axios.get<OrderDetailRes>(`/order/${id}`).then((res) => res.data);
};
/** 개별 주문 상세조회 훅 */
export const useOrderDetail = (
  id?: number,
): UseQueryResult<OrderDetailRes, AxiosError> => {
  return useQuery<OrderDetailRes, AxiosError>(
    ['OrderDetail', id],
    () => getOrderDetail(id),
    {
      enabled: !!id,
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
