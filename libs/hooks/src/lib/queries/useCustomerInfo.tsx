import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getCustomerInfo = async (id?: number): Promise<any> => {
  return axios.get<any>(`/customer/${id}`).then((res) => res.data);
};

export const useCustomerInfo = (id?: number): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(['getCustomerInfo', id], () => getCustomerInfo(id), {
    enabled: !!id,
  });
};
