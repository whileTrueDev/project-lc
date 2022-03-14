import { GoodsListDto, GoodsListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

type SellerGoodsListRequestDto = GoodsListDto & { sellerId: number };

export const getSellerGoodsList = async (dto: GoodsListDto): Promise<GoodsListRes> => {
  return axios
    .get<GoodsListRes>('/goods/list', {
      params: {
        ...dto,
      },
    })
    .then((res) => res.data);
};

export const useSellerGoodsList = (
  dto: SellerGoodsListRequestDto,
  options?: UseQueryOptions<GoodsListRes, AxiosError>,
): UseQueryResult<GoodsListRes, AxiosError> => {
  const { page, itemPerPage, sort, direction, groupId } = dto;
  const queryKey = ['SellerGoodsList', dto];
  return useQuery<GoodsListRes, AxiosError>(
    queryKey,
    () => getSellerGoodsList({ page, itemPerPage, sort, direction, groupId }),
    { retry: 1, keepPreviousData: true, ...options },
  );
};
