import {
  FindGoodsCategoryDto,
  GoodsCategoryRes,
  GoodsCategoryWithFamily,
} from '@project-lc/shared-types';
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

export type useOneGoodsCategoryResult = GoodsCategoryWithFamily | null;
export const getOneGoodsCategory = async (
  categoryCode?: string,
): Promise<useOneGoodsCategoryResult> => {
  if (!categoryCode) return null;
  return axios
    .get<useOneGoodsCategoryResult>(`/goods-category/${categoryCode}`)
    .then((res) => res.data);
};
export const useOneGoodsCategory = (
  categoryCode?: string,
): UseQueryResult<useOneGoodsCategoryResult, AxiosError> => {
  return useQuery<useOneGoodsCategoryResult, AxiosError>(
    'OneGoodsCategory',
    () => getOneGoodsCategory(categoryCode),
    { enabled: !!categoryCode },
  );
};
