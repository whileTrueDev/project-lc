import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type DuplicateFlag = boolean;

/** 방송인 상품홍보페이지 url 중복인지 확인 */
export const getAdminDuplicatePromotionPageFlag = async (
  url: string,
): Promise<DuplicateFlag> => {
  return axios
    .get<DuplicateFlag>('/admin/promotion-page/duplicate', { params: { url } })
    .then((res) => res.data);
};

export const useAdminDuplicatePromotionPageFlag = (
  url: string,
): UseQueryResult<DuplicateFlag, AxiosError> => {
  return useQuery<DuplicateFlag, AxiosError>(
    'AdminDuplicatePromotionPage',
    () => getAdminDuplicatePromotionPageFlag(url),
    { enabled: !!url },
  );
};
