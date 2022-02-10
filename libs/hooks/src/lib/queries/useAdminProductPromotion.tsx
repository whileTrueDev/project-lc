import { ProductPromotionListData } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

/** 특정 방송인홍보페이지 promotionPageId에 등록된 상품홍보목록 조회 */
export const getAdminProductPromotion = async (
  promotionPageId: number,
): Promise<ProductPromotionListData> => {
  return axios
    .get<ProductPromotionListData>('/admin/product-promotion-list', {
      params: { promotionPageId },
    })
    .then((res) => res.data);
};

export const useAdminProductPromotion = (
  promotionPageId: number,
): UseQueryResult<ProductPromotionListData, AxiosError> => {
  return useQuery<ProductPromotionListData, AxiosError>(
    ['AdminProductPromotion', promotionPageId],
    () => getAdminProductPromotion(promotionPageId),
  );
};
