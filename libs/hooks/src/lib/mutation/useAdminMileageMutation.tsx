import { CustomerMileage } from '@prisma/client';
import { CustomerMileageDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

/** 관리자 마일리지 수정 뮤테이션 훅 */
export const useAdminMileageMutation = (
  customerId: number,
): UseMutationResult<CustomerMileage, AxiosError, CustomerMileageDto> => {
  const queryClient = useQueryClient();
  return useMutation<CustomerMileage, AxiosError, CustomerMileageDto>(
    (dto: CustomerMileageDto) =>
      axios
        .patch<CustomerMileage>(`/admin/mileage/${customerId}`, dto)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminMileage', {
          refetchInactive: true,
        });
      },
    },
  );
};
