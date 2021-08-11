import { useMutation } from 'react-query';
import { SignUpSellerDto } from '@project-lc/shared-types';
import { Seller } from '@prisma/client';
import axios from '../../axios';

export type useSellerSignupMutationRes = Seller;

export const useSellerSignupMutation = () => {
  return useMutation((dto: SignUpSellerDto) =>
    axios.post<useSellerSignupMutationRes>('/seller', dto),
  );
};
