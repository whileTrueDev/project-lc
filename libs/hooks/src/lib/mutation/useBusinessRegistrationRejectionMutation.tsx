import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { BusinessRegistrationConfirmationDto } from '@project-lc/shared-types';
import { BusinessRegistrationConfirmation } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useBusinessRegistrationConfirmationMutation = (): UseMutationResult<
  any,
  AxiosError,
  BusinessRegistrationConfirmationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, BusinessRegistrationConfirmationDto>(
    (dto: BusinessRegistrationConfirmationDto) => {
      return axios.put<BusinessRegistrationConfirmation>(
        `/admin/business-registration/confirm`,
        dto,
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Settlement', { refetchInactive: true });
      },
    },
  );
};
