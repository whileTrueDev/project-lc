import { GoodsByIdRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const generateGoodsByIdKey = (
  goodsId: number | string,
): [string, number | string] => ['GoodsById', goodsId];
export const getGoodsById = async (goodsId: number | string): Promise<GoodsByIdRes> => {
  return axios.get<GoodsByIdRes>(`/goods/${goodsId}`).then((res) => res.data);
};

export const useGoodsById = (
  goodsId: number | string,
  initialData?: GoodsByIdRes,
): UseQueryResult<GoodsByIdRes, AxiosError> => {
  return useQuery<GoodsByIdRes, AxiosError>(
    generateGoodsByIdKey(goodsId),
    () => getGoodsById(goodsId),
    {
      initialData,
      enabled: !!goodsId,
    },
  );
};

/** 모든 상품 ID 배열을 불러옵니다 */
export const getAllGoodsIds = async (): Promise<number[]> => {
  return axios.get<number[]>('/goods/all-ids').then((res) => res.data);
};
