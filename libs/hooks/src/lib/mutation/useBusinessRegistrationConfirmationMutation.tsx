import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { BusinessRegistrationRejectionDto } from '@project-lc/shared-types';
import { BusinessRegistrationConfirmation } from '@prisma/client';
import { AxiosError } from 'axios';
import axios from '../../axios';

export const useBusinessRegistrationRejectionMutation = (): UseMutationResult<
  any,
  AxiosError,
  BusinessRegistrationRejectionDto
> => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, BusinessRegistrationRejectionDto>(
    (dto: BusinessRegistrationRejectionDto) => {
      return axios.put<BusinessRegistrationConfirmation>(
        `/admin/business-registration/reject`,
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
