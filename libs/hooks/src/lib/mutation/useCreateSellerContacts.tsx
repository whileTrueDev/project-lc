import { useMutation, UseMutationResult } from 'react-query';
import { SellerContactsDTOWithoutIdDTO } from '@project-lc/shared-types';
import { SellerContacts } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useCreateSellerContactsMutation = (): UseMutationResult<
  SellerContacts,
  AxiosError,
  SellerContactsDTOWithoutIdDTO
> => {
  return useMutation<SellerContacts, AxiosError, SellerContactsDTOWithoutIdDTO>(
    async (dto: SellerContactsDTOWithoutIdDTO) => {
      return axios.post<SellerContacts>('/seller/contacts', dto).then((res) => res.data);
    },
  );
};
