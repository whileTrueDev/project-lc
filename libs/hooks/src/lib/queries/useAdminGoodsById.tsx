import { GoodsByIdRes } from '@project-lc/shared-types';
import { useQuery } from 'react-query';
import axios from '../../axios';

export const getAdminGoodsById = async (
  goodsId: number | string,
): Promise<GoodsByIdRes> => {
  return axios.get<GoodsByIdRes>(`/admin/goods/${goodsId}`).then((res) => res.data);
};

export const useAdminGoodsById = (
  goodsId: number | string,
  initialData?: GoodsByIdRes,
) => {
  return useQuery<GoodsByIdRes>(
    ['AdminGoodsById', goodsId],
    () => getAdminGoodsById(goodsId),
    {
      initialData,
      enabled: !!goodsId,
    },
  );
};
