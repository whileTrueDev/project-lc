import { GoodsByIdRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminGoodsById = async (
  goodsId: number | string,
): Promise<GoodsByIdRes> => {
  return axios.get<GoodsByIdRes>(`/admin/goods/${goodsId}`).then((res) => res.data);
};

export const useAdminGoodsById = (
  goodsId: number | string,
  initialData?: GoodsByIdRes,
): UseQueryResult<GoodsByIdRes, AxiosError> => {
  return useQuery<GoodsByIdRes, AxiosError>(
    ['AdminGoodsById', goodsId],
    () => getAdminGoodsById(goodsId),
    {
      initialData,
      enabled: !!goodsId,
    },
  );
};
