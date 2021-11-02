import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type GoodsCommonInfo = {
  id: number;
  info_name: string;
};

export const getGoodsCommonInfoList = async (): Promise<GoodsCommonInfo[]> => {
  return axios.get<GoodsCommonInfo[]>('/goods/common-info/list').then((res) => res.data);
};

export const useGoodsCommonInfoList = ({
  email,
  enabled,
  onSuccess,
}: {
  email: string;
  enabled: boolean;
  onSuccess: (data: GoodsCommonInfo[]) => void;
}): UseQueryResult<GoodsCommonInfo[], AxiosError> => {
  return useQuery<GoodsCommonInfo[], AxiosError>(
    ['GoodsCommonInfoList', email],
    getGoodsCommonInfoList,
    {
      enabled,
      onSuccess,
    },
  );
};
