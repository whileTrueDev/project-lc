import { LiveShopping, SellerShop } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { BroadcasterDTO, LiveShoppingParamsDto } from '@project-lc/shared-types';
import axios from '../../axios';

interface LiveShoppingWithGoods extends LiveShopping {
  goods: {
    goods_name: string;
    summary: string;
  };
  seller: {
    sellerShop: SellerShop;
  };
  broadcaster: BroadcasterDTO;
  liveShoppingVideo: { youtubeUrl: string };
}

export const getAdminLiveShoppingList = async (
  dto: LiveShoppingParamsDto,
): Promise<LiveShoppingWithGoods[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/live-shoppings', {
      params: {
        liveShoppingId: dto.id,
        goodsIds: dto.goodsIds,
      },
    })
    .then((res) => res.data);
};

export const useAdminLiveShoppingList = (
  dto: LiveShoppingParamsDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['AdminLiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getAdminLiveShoppingList(dto || null),
    options,
  );
};
