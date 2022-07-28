import { KkshowSubNavLink } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult, UseQueryOptions } from 'react-query';
import axios from '../../axios';

export const getKkshowSubNav = async (): Promise<KkshowSubNavLink[]> => {
  return axios.get<KkshowSubNavLink[]>('/kkshow-subnav').then((res) => res.data);
};

export const useKkshowSubNav = (
  options?: UseQueryOptions<KkshowSubNavLink[], AxiosError>,
): UseQueryResult<KkshowSubNavLink[], AxiosError> => {
  return useQuery<KkshowSubNavLink[], AxiosError>('KkshowSubNav', getKkshowSubNav, {
    ...options,
  });
};
