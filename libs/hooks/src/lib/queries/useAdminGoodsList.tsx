import { GoodsListDto, GoodsListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

type SellerGoodsListRequestDto = GoodsListDto & { email?: string };

export const getAdminGoodsList = async (
  dto: Pick<GoodsListDto, 'sort' | 'direction'>,
): Promise<GoodsListRes> => {
  return axios
    .get<GoodsListRes>('/admin/goods', {
      params: {
        ...dto,
      },
    })
    .then((res) => res.data);
};

export const useAdminGoodsList = (
  dto: Pick<SellerGoodsListRequestDto, 'sort' | 'direction'>,
  options?: UseQueryOptions<GoodsListRes, AxiosError>,
): UseQueryResult<GoodsListRes, AxiosError> => {
  const { sort, direction } = dto;
  const queryKey = ['AdminGoodsList', dto];
  return useQuery<GoodsListRes, AxiosError>(
    queryKey,
    () => getAdminGoodsList({ sort, direction }),
    {
      retry: 1,
      ...options,
    },
  );
};
