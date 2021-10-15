import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type ApprovedGoodsList = {
  goods_name: string;
  id: number;
  firstmallGoodsConnectionId: number;
};

export const getApprovedGoodsList = async (
  email: string,
): Promise<ApprovedGoodsList[]> => {
  return axios
    .get<ApprovedGoodsList[]>('/live', {
      params: { email },
    })
    .then((res) => res.data);
};

export const useApprovedGoodsList = ({
  email,
}: {
  email: string;
}): UseQueryResult<ApprovedGoodsList[], AxiosError> => {
  return useQuery<ApprovedGoodsList[], AxiosError>(['ApprovedGoodsList', email], () =>
    getApprovedGoodsList(email),
  );
};
