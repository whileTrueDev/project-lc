import { GoodsInfo } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type GoodsCommonInfoItem = GoodsInfo;

export const getGoodsCommonInfoItem = async (
  id: number,
): Promise<GoodsCommonInfoItem> => {
  return axios
    .get<GoodsCommonInfoItem>('/goods/common-info', { params: { id } })
    .then((res) => res.data);
};

export const useGoodsCommonInfoItem = ({
  id,
  enabled,
  onSuccess,
}: {
  id: number;
  enabled: boolean;
  onSuccess: (data: GoodsCommonInfoItem) => void;
}): UseQueryResult<GoodsCommonInfoItem, AxiosError> => {
  return useQuery<GoodsCommonInfoItem, AxiosError>(
    ['GoodsCommonInfoItem', id],
    () => getGoodsCommonInfoItem(id),
    { enabled, onSuccess },
  );
};
