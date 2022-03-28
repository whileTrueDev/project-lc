import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getKkshowSearchResults = async (
  keyword: string | undefined,
): Promise<any> => {
  return axios
    .get<any>('/search', {
      params: {
        keyword,
      },
    })
    .then((res) => res.data);
};

export const useKkshowSearchResults = (
  keyword: string | undefined,
): UseQueryResult<any, AxiosError> => {
  const queryKey = ['getSearchResults', keyword];
  return useQuery<any, AxiosError>(queryKey, () => getKkshowSearchResults(keyword));
};
