import { SellerSettlementTargetRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getSellerSettlementTargets =
  async (): Promise<SellerSettlementTargetRes> => {
    return axios
      .get<SellerSettlementTargetRes>('/admin/settlement/targets')
      .then((res) => res.data);
  };

export const useSellerSettlementTargets = (
  initialData?: SellerSettlementTargetRes,
): UseQueryResult<SellerSettlementTargetRes, AxiosError> => {
  return useQuery<SellerSettlementTargetRes, AxiosError>(
    'SellerSettlementTargets',
    getSellerSettlementTargets,
    { initialData },
  );
};
