import { useMutation } from 'react-query';
import { BusinessRegistrationDto } from '@project-lc/shared-types';
import { SellerBusinessRegistration } from '@prisma/client';
import axios from '../../axios';

export const useBusinessRegistrationMutation = () => {
  return useMutation((dto: BusinessRegistrationDto) => {
    return axios.post<SellerBusinessRegistration>('/seller/business-registration', dto);
  });
};
