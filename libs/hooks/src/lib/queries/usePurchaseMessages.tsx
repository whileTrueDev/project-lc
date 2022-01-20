import { LiveShoppingPurchaseMessage } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getPurchaseMessages = async (
  liveShoppingId: number,
): Promise<LiveShoppingPurchaseMessage[]> => {
  return axios
    .get<LiveShoppingPurchaseMessage[]>(
      '/live-shoppings/current-state-purchase-messages',
      {
        params: { liveShoppingId },
      },
    )
    .then((res) => res.data);
};

export const usePurchaseMessages = ({
  liveShoppingId,
  refetchInterval,
}: {
  liveShoppingId: number;
  refetchInterval?: number;
}): UseQueryResult<LiveShoppingPurchaseMessage[], AxiosError> => {
  return useQuery<LiveShoppingPurchaseMessage[], AxiosError>(
    ['PurchaseMessages', liveShoppingId],
    () => getPurchaseMessages(liveShoppingId),
    {
      refetchInterval,
      enabled: !!liveShoppingId,
    },
  );
};
