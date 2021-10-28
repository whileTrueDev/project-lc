import { FindSettlementHistoryDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import {
  LiveShopping,
  Seller,
  SellerSettlementItems,
  SellerSettlements,
  SellerShop,
} from '.prisma/client';
import axios from '../../axios';

export type SettlementDoneItem = SellerSettlements & {
  settlementItems: Array<SellerSettlementItems & { liveShopping: LiveShopping }>;
  seller: Seller & { sellerShop: SellerShop };
};
export type SettlementDoneList = Array<SettlementDoneItem>;

export const getSettlementHistory = async (
  dto: FindSettlementHistoryDto,
): Promise<SettlementDoneList> => {
  return axios
    .get<SettlementDoneList>(
      '/seller/settlement-history',
      dto ? { params: { ...dto } } : undefined,
    )
    .then((res) => res.data);
};

export const useSettlementHistory = (
  dto: FindSettlementHistoryDto,
  options: UseQueryOptions<SettlementDoneList, AxiosError>,
): UseQueryResult<SettlementDoneList, AxiosError> => {
  return useQuery<SettlementDoneList, AxiosError>(
    ['SettlementDoneList', dto.round],
    () => getSettlementHistory(dto),
    options,
  );
};
