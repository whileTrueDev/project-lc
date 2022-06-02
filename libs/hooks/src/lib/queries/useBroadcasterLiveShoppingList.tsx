import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import axios from '../../axios';

// return type any로 안하면 리액트 테이블에서 컬럼 린트 에러 발생
export const getBroadcasterLiveShoppingList = async (
  broadcasterId: number | undefined,
): Promise<LiveShoppingWithGoods[]> => {
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
}): UseQueryResult<LiveShoppingWithGoods[], AxiosError> => {
  const queryKey = ['broadcasterLiveShoppingList', broadcasterId];
  return useQuery<LiveShoppingWithGoods[], AxiosError>(
    queryKey,
    () => getBroadcasterLiveShoppingList(broadcasterId),
    { enabled: !!broadcasterId },
  );
};
