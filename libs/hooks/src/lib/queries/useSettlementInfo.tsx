import { useQuery, UseQueryOptions, QueryObserverResult } from 'react-query';
import {
  SellerSettlementAccount,
  SellerBusinessRegistration,
  SellerSettlements,
} from '@prisma/client';
import axios from '../../axios';

// 전달되어야하는 형태
export type SettlementInfoType = {
  sellerSettlementAccount: SellerSettlementAccount[];
  sellerSettlements: SellerSettlements[];
  sellerBusinessRegistration: SellerBusinessRegistration[];
};

export type SettlementInfoRefetchType = () => Promise<
  QueryObserverResult<SettlementInfoType, unknown>
>;

export function getSettlementInfo() {
  return axios.get<SettlementInfoType>('/seller/settlement').then((res) => res.data);
}

export function useSettlementInfo(options?: UseQueryOptions<SettlementInfoType>) {
  return useQuery<SettlementInfoType>('SettlementInfo', getSettlementInfo, {
    ...options,
  });
}
