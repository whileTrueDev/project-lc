import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type ApprovedGoodsList = {
  email: string;
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
