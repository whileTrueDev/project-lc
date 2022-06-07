import { AdminGoodsByIdRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminGoodsById = async (
  goodsId: number | string,
): Promise<AdminGoodsByIdRes> => {
  return axios.get<AdminGoodsByIdRes>(`/admin/goods/${goodsId}`).then((res) => res.data);
};

export const useAdminGoodsById = (
  goodsId: number | string,
  initialData?: AdminGoodsByIdRes,
): UseQueryResult<AdminGoodsByIdRes, AxiosError> => {
  return useQuery<AdminGoodsByIdRes, AxiosError>(
    ['AdminGoodsById', goodsId],
    () => getAdminGoodsById(goodsId),
    { initialData, enabled: !!goodsId },
  );
};
