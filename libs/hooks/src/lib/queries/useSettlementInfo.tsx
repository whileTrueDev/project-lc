import {
  useQuery,
  UseQueryOptions,
  QueryObserverResult,
  UseQueryResult,
} from 'react-query';
import {
  SellerSettlementAccount,
  SellerBusinessRegistration,
  SellerSettlements,
} from '@prisma/client';
import { AxiosError } from 'axios';
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

export function getSettlementInfo(): Promise<SettlementInfoType> {
  return axios.get<SettlementInfoType>('/seller/settlement').then((res) => res.data);
}

export function useSettlementInfo(
  options?: UseQueryOptions<SettlementInfoType, AxiosError>,
): UseQueryResult<SettlementInfoType, AxiosError> {
  return useQuery<SettlementInfoType, AxiosError>('SettlementInfo', getSettlementInfo, {
    ...options,
  });
}
