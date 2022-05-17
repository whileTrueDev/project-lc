import { GoodsByIdRes } from '@project-lc/shared-types';
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
