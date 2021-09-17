// 등록된 계좌 리스트
// 등록된 사업자 등록증 리스트
import { SellerSettlementAccount, SellerBusinessRegistration } from '@prisma/client';
import { useQuery, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export type AdminSettlementInfoType = {
  sellerSettlementAccount: SellerSettlementAccount[];
  sellerBusinessRegistration: SellerBusinessRegistration[];
};

export function getAdminSettlementInfo() {
  return axios.get<AdminSettlementInfoType>('/admin/settlement').then((res) => res.data);
}

export function useAdminSettlementInfo(
  options?: UseQueryOptions<AdminSettlementInfoType>,
) {
  return useQuery<AdminSettlementInfoType>('Settlement', getAdminSettlementInfo, {
    ...options,
  });
}
