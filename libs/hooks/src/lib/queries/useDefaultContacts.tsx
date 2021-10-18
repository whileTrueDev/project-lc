import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { SellerContactsDTO } from '@project-lc/shared-types';
import axios from '../../axios';

export const getDefaultSellerContact = async (
  email: string,
): Promise<SellerContactsDTO> => {
  return axios
    .get<SellerContactsDTO>('/seller/contacts', {
      params: { email },
    })
    .then((res) => res.data);
};

export const useDefaultContacts = ({
  email,
}: {
  email: string;
}): UseQueryResult<SellerContactsDTO, AxiosError> => {
  return useQuery<SellerContactsDTO, AxiosError>(['defaultSellerContact', email], () =>
    getDefaultSellerContact(email),
  );
};
