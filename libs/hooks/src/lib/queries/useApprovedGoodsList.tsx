import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ApprovedGoodsListItem } from '@project-lc/shared-types';
import axios from '../../axios';

export const getApprovedGoodsList = async (): Promise<ApprovedGoodsListItem[]> => {
  return axios
    .get<ApprovedGoodsListItem[]>('/live-shoppings/confirmed-goods')
    .then((res) => res.data);
};

export const useApprovedGoodsList = (): UseQueryResult<
  ApprovedGoodsListItem[],
  AxiosError
> => {
  return useQuery<ApprovedGoodsListItem[], AxiosError>(['ApprovedGoodsList'], () =>
    getApprovedGoodsList(),
  );
};
