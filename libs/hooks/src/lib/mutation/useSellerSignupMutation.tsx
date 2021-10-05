import { useMutation, UseMutationResult } from 'react-query';
import { SignUpSellerDto } from '@project-lc/shared-types';
import { Seller } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useSellerSignupMutation = (): UseMutationResult<
  Seller,
  AxiosError,
  SignUpSellerDto
> => {
  return useMutation((dto: SignUpSellerDto) =>
    axios.post<Seller>('/seller', dto).then((res) => res.data),
  );
};
