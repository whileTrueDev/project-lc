import { useMutation, UseMutationResult } from 'react-query';
import { SellerContactsDTOWithoutIdDTO } from '@project-lc/shared-types';
import { SellerContacts } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useCreateSellerContacts = (): UseMutationResult<
  SellerContacts,
  AxiosError,
  SellerContactsDTOWithoutIdDTO
> => {
  return useMutation<SellerContacts, AxiosError, SellerContactsDTOWithoutIdDTO>(
    async (dto: SellerContactsDTOWithoutIdDTO) => {
      return axios
        .post<SellerContacts>('/seller/contacts-create', dto)
        .then((res) => res.data);
    },
  );
};
