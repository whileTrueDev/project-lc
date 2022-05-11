import { GoodsByIdRes } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
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
    { initialData, enabled: !!goodsId },
  );
};
