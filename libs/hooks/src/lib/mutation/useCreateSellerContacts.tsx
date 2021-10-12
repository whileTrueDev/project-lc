import { useMutation, UseMutationResult } from 'react-query';
import { SellerContactsDTO } from '@project-lc/shared-types';
import { SellerContacts } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useCreateSellerContacts = (): UseMutationResult<
  SellerContacts,
  AxiosError,
  SellerContactsDTO
> => {
  return useMutation<SellerContacts, AxiosError, SellerContactsDTO>(
    async (dto: SellerContactsDTO) => {
      return axios
        .post<SellerContacts>('/seller/contacts-create', dto)
        .then((res) => res.data);
    },
  );
};
