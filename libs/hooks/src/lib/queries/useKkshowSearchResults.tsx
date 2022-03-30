import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { SearchResult } from '@project-lc/shared-types';
import axios from '../../axios';

export const getKkshowSearchResults = async (
  keyword: string | undefined,
): Promise<SearchResult> => {
  return axios
    .get<SearchResult>('/search', {
      params: {
        keyword,
      },
    })
    .then((res) => res.data);
};

export const useKkshowSearchResults = (
  keyword: string | undefined,
): UseQueryResult<SearchResult, AxiosError> => {
  const queryKey = ['getSearchResults', keyword];
  return useQuery<SearchResult, AxiosError>(
    queryKey,
    () => getKkshowSearchResults(keyword),
    { enabled: !!keyword },
  );
};
