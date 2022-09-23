import { KkshowEventPopup } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getKkshowEventPopup = async (): Promise<KkshowEventPopup[]> => {
  return axios.get<KkshowEventPopup[]>('/kkshow-event-popup').then((res) => res.data);
};

export const useKkshowEventPopup = (): UseQueryResult<KkshowEventPopup[], AxiosError> => {
  return useQuery<KkshowEventPopup[], AxiosError>(
    'KkshowEventPopup',
    getKkshowEventPopup,
  );
};
