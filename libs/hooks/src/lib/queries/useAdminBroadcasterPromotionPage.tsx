import { BroadcasterPromotionPageListRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminBroadcasterPromotionPage = BroadcasterPromotionPageListRes;

export const getAdminBroadcasterPromotionPage =
  async (): Promise<AdminBroadcasterPromotionPage> => {
    return axios
      .get<AdminBroadcasterPromotionPage>('/admin/promotion-page/list')
      .then((res) => res.data);
  };

export const useAdminBroadcasterPromotionPage = (): UseQueryResult<
  AdminBroadcasterPromotionPage,
  AxiosError
> => {
  return useQuery<AdminBroadcasterPromotionPage, AxiosError>(
    'AdminBroadcasterPromotionPageList',
    getAdminBroadcasterPromotionPage,
  );
};
