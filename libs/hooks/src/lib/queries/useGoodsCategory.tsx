import { FindGoodsCategoryDto, GoodsCategoryRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getGoodsCategory = async (
  dto: FindGoodsCategoryDto,
): Promise<GoodsCategoryRes> => {
  return axios
    .get<GoodsCategoryRes>('/goods-category', { params: dto })
    .then((res) => res.data);
};
/** 상품카테고리 조회 */
export const useGoodsCategory = (
  dto: FindGoodsCategoryDto,
  options?: UseQueryOptions<GoodsCategoryRes, AxiosError>,
): UseQueryResult<GoodsCategoryRes, AxiosError> => {
  return useQuery<GoodsCategoryRes, AxiosError>(
    ['GoodsCategory', dto],
    () => getGoodsCategory(dto),
    options,
  );
};
