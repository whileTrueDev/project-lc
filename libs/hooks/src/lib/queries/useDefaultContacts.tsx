import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getDefaultSellerContact = async (): Promise<any> => {
  return axios.get<any>('/seller/contacts').then((res) => res.data);
};

export const useDefaultContacts = ({
  id,
}: {
  id: number | string;
}): UseQueryResult<any, AxiosError> => {
  return useQuery<any, AxiosError>(['defaultSellerContact', id], getDefaultSellerContact);
};
