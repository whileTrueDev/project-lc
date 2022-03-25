import { Manual } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getManual = async (id: number): Promise<Manual> => {
  return axios.get<Manual>('/manual', { params: { id } }).then((res) => res.data);
};

export const useManual = (id: number): UseQueryResult<Manual, AxiosError> => {
  return useQuery<Manual, AxiosError>(['Manual', id], () => getManual(id), {
    enabled: !!id,
  });
};
