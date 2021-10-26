import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import {
  LiveShopping,
  Seller,
  SellerSettlementItems,
  SellerSettlements,
  SellerShop,
} from '.prisma/client';
import axios from '../../axios';

export type SettlementDoneList = Array<
  SellerSettlements & {
    settlementItems: Array<SellerSettlementItems & { liveShopping: LiveShopping }>;
    seller: Seller & { sellerShop: SellerShop };
  }
>;

export const getSettlementHistory = async (): Promise<SettlementDoneList> => {
  return axios
    .get<SettlementDoneList>('/seller/settlement-history')
    .then((res) => res.data);
};

export const useSettlementHistory = (): UseQueryResult<
  SettlementDoneList,
  AxiosError
> => {
  return useQuery<SettlementDoneList, AxiosError>(
    'SettlementDoneList',
    getSettlementHistory,
  );
};
