import { GoodsOptionWithStockInfo } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

// project-lc Goods db 재고 조회
export const getGoodsStock = async (id: number): Promise<GoodsOptionWithStockInfo[]> => {
  return axios
    .get<GoodsOptionWithStockInfo[]>('/goods/stock', { params: { id } })
    .then((res) => res.data);
};

// 퍼스트몰 fm_goods_option , fm_goods_supply 재고조회
export const getFmGoodsStock = async (
  id: number,
): Promise<GoodsOptionWithStockInfo[]> => {
  return axios
    .get<GoodsOptionWithStockInfo[]>('/fm-goods/stock', { params: { id } })
    .then((res) => res.data);
};

export const useGoodsStock = (
  goodsId: number,
  confirmedGoodsId?: null | number,
  options?: UseQueryOptions<GoodsOptionWithStockInfo[], AxiosError>,
): UseQueryResult<GoodsOptionWithStockInfo[], AxiosError> => {
  const queryKey =
    confirmedGoodsId != null
      ? ['FmGoodsStock', confirmedGoodsId]
      : ['GoodsStock', goodsId];

  const queryFn =
    confirmedGoodsId != null
      ? () => getFmGoodsStock(confirmedGoodsId)
      : () => getGoodsStock(goodsId);

  return useQuery<GoodsOptionWithStockInfo[], AxiosError>(queryKey, queryFn, {
    ...options,
  });
};
