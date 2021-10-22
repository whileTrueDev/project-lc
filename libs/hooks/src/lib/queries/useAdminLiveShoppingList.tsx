import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { BroadcasterDTO } from '@project-lc/shared-types';
import axios from '../../axios';

export interface LiveShoppingWithGoods extends LiveShopping {
  goods: {
    goods_name: string;
    summary: string;
  };
  seller: {
    sellerShop: {
      sellerEmail: string;
      shopName: string;
    };
  };
  broadcaster: BroadcasterDTO;
}

export const getAdminLiveShoppingList = async (
  liveShoppingId?: string | null,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/admin/live-shoppings', {
      params: { liveShoppingId },
    })
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (dto: {
  enabled: boolean;
  id?: string;
}): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminGoodsList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(queryKey, () =>
    getAdminLiveShoppingList(dto.id || null),
  );
};
