import {
  AdminAllLcGoodsList,
  AdminGoodsListRes,
  GoodsListDto
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 검수가 필요한 상품목록 조회 */
type SellerGoodsListRequestDto = GoodsListDto & { email?: string };



export const getAdminGoodsList = async (
  dto: Pick<GoodsListDto, 'sort' | 'direction'>,
): Promise<AdminGoodsListRes> => {
  return axios
    .get<AdminGoodsListRes>('/admin/goods', {
      params: {
        ...dto,
      },
    })
    .then((res) => res.data);
};

export const useAdminGoodsList = (
  dto: Pick<SellerGoodsListRequestDto, 'sort' | 'direction'>,
  options?: UseQueryOptions<AdminGoodsListRes, AxiosError>,
): UseQueryResult<AdminGoodsListRes, AxiosError> => {
  const { sort, direction } = dto;
  const queryKey = ['AdminGoodsList', dto];
  return useQuery<AdminGoodsListRes, AxiosError>(
    queryKey,
    () => getAdminGoodsList({ sort, direction }),
    {
      retry: 1,
      ...options,
    },
  );
};

/** 검수완료 & 판매상태 정상인 모든 상품 조회 */
export const getAdminAllConfirmedLcGoodsList = async (): Promise<AdminAllLcGoodsList> => {
  return axios
    .get<AdminAllLcGoodsList>('/admin/confirmed-goods-list')
    .then((res) => res.data);
};
export const useAdminAllConfirmedLcGoodsList = (): UseQueryResult<
  AdminAllLcGoodsList,
  AxiosError
> => {
  return useQuery<AdminAllLcGoodsList, AxiosError>(
    'AdminAllConfirmedLcGoodsList',
    getAdminAllConfirmedLcGoodsList,
  );
};
