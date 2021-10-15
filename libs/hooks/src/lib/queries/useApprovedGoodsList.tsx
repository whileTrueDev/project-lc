import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ApprovedGoodsListItem } from '@project-lc/shared-types';
import axios from '../../axios';

export const getApprovedGoodsList = async (
  email: string,
): Promise<ApprovedGoodsListItem[]> => {
  return axios
    .get<ApprovedGoodsListItem[]>('/live-shopping/confirmed-goods', {
      params: { email },
    })
    .then((res) => res.data);
};

export const useApprovedGoodsList = ({
  email,
}: {
  email: string;
}): UseQueryResult<ApprovedGoodsListItem[], AxiosError> => {
  return useQuery<ApprovedGoodsListItem[], AxiosError>(['ApprovedGoodsList', email], () =>
    getApprovedGoodsList(email),
  );
};
