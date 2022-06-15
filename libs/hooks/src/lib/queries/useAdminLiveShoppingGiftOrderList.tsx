import { AdminLiveShoppingGiftOrder } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminLiveShoppingGiftOrderList = AdminLiveShoppingGiftOrder[];

export const getAdminLiveShoppingGiftOrderList = async ({
  liveShoppingId,
}: {
  liveShoppingId: number | null;
}): Promise<AdminLiveShoppingGiftOrderList> => {
  return axios
    .get<AdminLiveShoppingGiftOrderList>(
      `/admin/live-shopping/${liveShoppingId}/gift-orders`,
    )
    .then((res) => res.data);
};

export const useAdminLiveShoppingGiftOrderList = ({
  liveShoppingId,
}: {
  liveShoppingId: number | null;
}): UseQueryResult<AdminLiveShoppingGiftOrderList, AxiosError> => {
  return useQuery<AdminLiveShoppingGiftOrderList, AxiosError>(
    ['AdminLiveShoppingGiftOrderList', liveShoppingId],
    () => getAdminLiveShoppingGiftOrderList({ liveShoppingId }),
    { enabled: !!liveShoppingId },
  );
};
