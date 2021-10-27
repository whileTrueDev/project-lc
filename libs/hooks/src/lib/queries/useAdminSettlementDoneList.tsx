import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { LiveShopping, SellerSettlementItems, SellerSettlements } from '.prisma/client';
import axios from '../../axios';

export type AdminSettlementDoneList = Array<
  SellerSettlements & {
    settlementItems: Array<SellerSettlementItems & { liveShopping: LiveShopping }>;
  }
>;

export const getAdminSettlementDoneList = async (): Promise<AdminSettlementDoneList> => {
  return axios
    .get<AdminSettlementDoneList>('/admin/settlement-history')
    .then((res) => res.data);
};

export const useAdminSettlementDoneList = (): UseQueryResult<
  AdminSettlementDoneList,
  AxiosError
> => {
  return useQuery<AdminSettlementDoneList, AxiosError>(
    'AdminSettlementDoneList',
    getAdminSettlementDoneList,
  );
};
