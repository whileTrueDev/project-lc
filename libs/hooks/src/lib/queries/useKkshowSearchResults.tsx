import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getSearchResults = async (keyword: string): Promise<any> => {
  return axios
    .get<any>('/search', {
      params: {
        keyword,
      },
    })
    .then((res) => res.data);
};

export const useSearchResults = (keyword: string): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(
    'getSearchResults',
    () => getSearchResults(keyword),
    {},
  );
};
