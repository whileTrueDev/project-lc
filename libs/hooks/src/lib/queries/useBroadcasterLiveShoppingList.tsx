import { LiveShopping } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import { BroadcasterDTO } from '@project-lc/shared-types';
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
// return type any로 안하면 리액트 테이블에서 컬럼 린트 에러 발생
export const getBroadcasterLiveShoppingList = async (
  broadcasterId: number | undefined,
): Promise<any[]> => {
  return axios
    .get<LiveShoppingWithGoods[]>('/live-shoppings/broadcaster', {
      params: {
        broadcasterId,
      },
    })
    .then((res) => res.data);
};

export const useBroadcasterLiveShoppingList = ({
  broadcasterId,
}: {
  broadcasterId: number | undefined;
}): UseQueryResult<any[], AxiosError> => {
  const queryKey = ['broadcasterLiveShoppingList', broadcasterId];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getBroadcasterLiveShoppingList(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
