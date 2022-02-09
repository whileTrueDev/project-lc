import { useQuery, UseQueryResult } from 'react-query';
import { SellType } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getSellerSellType = async (
  fmGoodsSeq?: number | string,
): Promise<SellType> => {
  return axios
    .get<SellType>(`/seller/selltype`, { params: { fmGoodsSeq } })
    .then((res) => res.data);
};

export const useSellerSellType = (
  fmGoodsSeq?: number | string,
): UseQueryResult<SellType, AxiosError> => {
  return useQuery<SellType, AxiosError>(['getSellerSellType', fmGoodsSeq], () =>
    getSellerSellType(fmGoodsSeq),
  );
};
