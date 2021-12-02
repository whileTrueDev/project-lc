import { useMutation, UseMutationResult } from 'react-query';
import { SignUpDto } from '@project-lc/shared-types';
import { Broadcaster, Seller } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

/** 판매자 생성 훅 */
export const useSellerSignupMutation = (): UseMutationResult<
  Seller,
  AxiosError,
  SignUpDto
> => {
  return useMutation((dto: SignUpDto) =>
    axios.post<Seller>('/seller', dto).then((res) => res.data),
  );
};

/** 방송인 생성 훅 */
export const useBroadcasterSignupMutation = (): UseMutationResult<
  Broadcaster,
  AxiosError,
  SignUpDto
> => {
  return useMutation((dto: SignUpDto) =>
    axios.post<Broadcaster>('/broadcaster', dto).then((res) => res.data),
  );
};
