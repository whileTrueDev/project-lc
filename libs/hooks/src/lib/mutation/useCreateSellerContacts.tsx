import { useMutation, UseMutationResult } from 'react-query';
import { SellerContactsDTO } from '@project-lc/shared-types';
import { SellerContacts } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type SubPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SellerContactsDTOWithoutIdDTO = SubPartial<SellerContactsDTO, 'id'>;

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
