import { useQuery, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { Inquiry } from '@prisma/client';
import axios from '../../axios';

export const getAdminInquiry = async (): Promise<Inquiry[]> => {
  return axios.get<Inquiry[]>(`/inquiry`).then((res) => res.data);
};

export const useAdminInquiry = (): UseQueryResult<Inquiry[], AxiosError> => {
  return useQuery<Inquiry[], AxiosError>(['getAdminInquiry'], getAdminInquiry);
};
