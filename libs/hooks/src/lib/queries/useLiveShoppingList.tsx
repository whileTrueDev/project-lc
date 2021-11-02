import { LiveShopping } from '@prisma/client';
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
    sellerShop: {
      sellerEmail: string;
      shopName: string;
    };
  };
  broadcaster: BroadcasterDTO;
  liveShoppingVideo: { youtubeUrl: string };
}

export const getLiveShoppingList = async (
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

export const useLiveShoppingList = (
  dto: LiveShoppingParamsDto,
  options?: UseQueryOptions<LiveShoppingWithGoods[], AxiosError>,
): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['LiveShoppingList', dto];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getLiveShoppingList(dto || null),
    options,
  );
};
