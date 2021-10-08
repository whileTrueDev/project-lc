import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type ApprovedGoodsList = {
  email: string;
};

export const getApprovedGoodsList = async (): Promise<ApprovedGoodsList[]> => {
  return axios.get<ApprovedGoodsList[]>('/live').then((res) => res.data);
};

export const useApprovedGoodsList = ({
  email,
  needName,
}: {
  email: string;
  needName: boolean;
}): UseQueryResult<ApprovedGoodsList[], AxiosError> => {
  return useQuery<ApprovedGoodsList[], AxiosError>(
    ['ApprovedGoodsList', email, needName],
    getApprovedGoodsList,
  );
};
