import { useQuery, UseQueryResult } from 'react-query';
import { FindFmOrdersDto, FindFmOrderRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const getFmOrdersStats = async (): Promise<FindFmOrderRes[]> => {
  return axios.get<FindFmOrderRes[]>('/fm-orders/stats').then((res) => res.data);
};

export const useFmOrdersStats = (): UseQueryResult<FindFmOrderRes[], AxiosError> => {
  return useQuery<FindFmOrderRes[], AxiosError>(['FmOrdersStats'], () =>
    getFmOrdersStats(),
  );
};
