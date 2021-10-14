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

export const getAdminLiveShoppingList = async (): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/admin/live-shopping')
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (
  dto: any,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminGoodsList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    getAdminLiveShoppingList,
  );
};
