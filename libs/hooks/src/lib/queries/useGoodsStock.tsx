import { GoodsOptionWithStockInfo } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import axios from '../../axios';

// 크크쇼 Goods db 재고 조회
export const getGoodsStock = async (id: number): Promise<GoodsOptionWithStockInfo[]> => {
  return axios
    .get<GoodsOptionWithStockInfo[]>('/goods/stock', { params: { id } })
    .then((res) => res.data);
};

export const useGoodsStock = (
  goodsId: number,
  options?: UseQueryOptions<GoodsOptionWithStockInfo[], AxiosError>,
): UseQueryResult<GoodsOptionWithStockInfo[], AxiosError> => {
  return useQuery<GoodsOptionWithStockInfo[], AxiosError>(
    ['GoodsStock', goodsId],
    () => getGoodsStock(goodsId),
    { ...options },
  );
};
