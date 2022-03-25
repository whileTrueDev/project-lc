import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getKkshowSearchResults = async (keyword: string): Promise<any> => {
  return axios
    .get<any>('/search', {
      params: {
        keyword,
      },
    })
    .then((res) => res.data);
};

export const useKkshowSearchResults = (
  keyword: string,
): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(
    'getSearchResults',
    () => getKkshowSearchResults(keyword),
    {},
  );
};
