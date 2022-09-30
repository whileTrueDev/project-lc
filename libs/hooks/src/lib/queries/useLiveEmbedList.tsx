import { LiveShoppingEmbed } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type LiveEmbedList = Array<LiveShoppingEmbed>;

export const getLiveEmbedList = async (): Promise<LiveEmbedList> => {
  return axios.get<LiveEmbedList>('/kkshow-live-embed').then((res) => res.data);
};

export const useLiveEmbedList = (): UseQueryResult<LiveEmbedList, AxiosError> => {
  return useQuery<LiveEmbedList, AxiosError>('LiveEmbedList', getLiveEmbedList);
};
