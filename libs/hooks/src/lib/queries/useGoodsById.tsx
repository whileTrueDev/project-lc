import { GoodsByIdRes, GoodsOutlineByIdRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const generateGoodsByIdKey = (
  goodsId: number | string | null,
): [string, number | string | null] => ['GoodsById', goodsId];

export const getGoodsById = async (
  goodsId: number | string | null,
): Promise<GoodsByIdRes> => {
  return axios.get<GoodsByIdRes>(`/goods/${goodsId}`).then((res) => res.data);
};
/** 상품번호를 통해 상품 정보 조회 */
export const useGoodsById = (
  goodsId: number | string | null,
  initialData?: GoodsByIdRes,
): UseQueryResult<GoodsByIdRes, AxiosError> => {
  return useQuery<GoodsByIdRes, AxiosError>(
    generateGoodsByIdKey(goodsId),
    () => getGoodsById(goodsId),
    { initialData, enabled: !!goodsId },
  );
};

export const getGoodsOutlineById = async (
  goodsId: number | string | null,
): Promise<GoodsOutlineByIdRes> => {
  return axios
    .get<GoodsOutlineByIdRes>(`/goods/${goodsId}/outline`)
    .then((res) => res.data);
};
/** 상품번호를 통해 상품 간략 정보 조회 */
export const useGoodsOutlineById = (
  goodsId: number | string | null,
  initialData?: GoodsOutlineByIdRes,
): UseQueryResult<GoodsOutlineByIdRes, AxiosError> => {
  return useQuery<GoodsOutlineByIdRes, AxiosError>(
    ['GoodsOutlineById', goodsId],
    () => getGoodsOutlineById(goodsId),
    { initialData, enabled: !!goodsId },
  );
};

export type AllGoodsIdsRes = number[];

export const ALL_GOODS_IDS_KEY = 'AllGoodsIds';
export const getAllGoodsIds = async (): Promise<AllGoodsIdsRes> => {
  return axios
    .get<AllGoodsIdsRes>('/goods/all-ids')
    .then((res) => res.data)
    .catch(() => []);
};

export const useAllGoodsIds = (): UseQueryResult<AllGoodsIdsRes, AxiosError> => {
  return useQuery<AllGoodsIdsRes, AxiosError>(ALL_GOODS_IDS_KEY, getAllGoodsIds);
};
