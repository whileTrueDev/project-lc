import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

interface LiveShoppingWithGoods extends LiveShopping {
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
}

export const getAdminLiveShoppingList = async (
  liveShoppingId?: string | null,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/admin/live-shopping', { params: { liveShoppingId } })
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
