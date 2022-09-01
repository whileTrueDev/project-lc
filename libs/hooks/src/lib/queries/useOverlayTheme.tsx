import { OverlayTheme } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getOverlayThemeList = async (): Promise<OverlayTheme[]> => {
  return axios.get<OverlayTheme[]>('/admin/overlay-theme/list').then((res) => res.data);
};

export const useOverlayThemeList = (): UseQueryResult<OverlayTheme[], AxiosError> => {
  return useQuery<OverlayTheme[], AxiosError>(
    'AdminOverlayThemeList',
    getOverlayThemeList,
  );
};
