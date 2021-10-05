import { SellerBusinessRegistration } from '@prisma/client';
import { BusinessRegistrationDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const useBusinessRegistrationMutation = (): UseMutationResult<
  SellerBusinessRegistration,
  AxiosError,
  BusinessRegistrationDto
> => {
  return useMutation<SellerBusinessRegistration, AxiosError, BusinessRegistrationDto>(
    (dto: BusinessRegistrationDto) => {
      return axios
        .post<SellerBusinessRegistration>('/seller/business-registration', dto)
        .then((res) => res.data);
    },
  );
};
