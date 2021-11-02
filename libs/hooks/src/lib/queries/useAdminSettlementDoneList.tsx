import { Seller, SellerShop } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { LiveShopping, SellerSettlementItems, SellerSettlements } from '.prisma/client';
import axios from '../../axios';

export type IAdminSettlementDoneList = Array<
  SellerSettlements & {
    settlementItems: Array<SellerSettlementItems & { liveShopping: LiveShopping }>;
    seller: Seller & {
      sellerShop: SellerShop;
    };
  }
>;

export const getAdminSettlementDoneList = async (): Promise<IAdminSettlementDoneList> => {
  return axios
    .get<IAdminSettlementDoneList>('/admin/settlement-history')
    .then((res) => res.data);
};

export const useAdminSettlementDoneList = (): UseQueryResult<
  IAdminSettlementDoneList,
  AxiosError
> => {
  return useQuery<IAdminSettlementDoneList, AxiosError>(
    'AdminSettlementDoneList',
    getAdminSettlementDoneList,
  );
};
