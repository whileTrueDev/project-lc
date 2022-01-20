import { SellerContractionAgreementDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { Seller } from '.prisma/client';
import axios from '../../axios';

export type useSellerUpdateContractionAgreementMutationRes = Seller;

export const useSellerUpdateContractionAgreementMutation = (): UseMutationResult<
  useSellerUpdateContractionAgreementMutationRes,
  AxiosError,
  SellerContractionAgreementDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useSellerUpdateContractionAgreementMutationRes,
    AxiosError,
    SellerContractionAgreementDto
  >(
    (dto: SellerContractionAgreementDto) =>
      axios
        .patch<useSellerUpdateContractionAgreementMutationRes>('/seller/agreement', dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('Profile');
      },
    },
  );
};
