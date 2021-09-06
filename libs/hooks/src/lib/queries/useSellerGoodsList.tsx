import { GoodsListDto, GoodsListRes } from '@project-lc/shared-types';
import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

type SellerGoodsListRequestDto = GoodsListDto & { email: string };

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
  options?: UseQueryOptions<GoodsListRes>,
) => {
  const { page, itemPerPage, sort, direction } = dto;
  const queryKey = ['SellerGoodsList', dto];
  return useQuery<GoodsListRes>(
    queryKey,
    () => getSellerGoodsList({ page, itemPerPage, sort, direction }),
    { retry: 1, keepPreviousData: true, ...options },
  );
};
