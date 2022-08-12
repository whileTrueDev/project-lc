import { LiveShoppingSpecialPriceUpdateDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export interface useAdminUpdateLiveShoppingSpecialPriceMutationDto {
  id: number;
  dto: LiveShoppingSpecialPriceUpdateDto;
}
export type useAdminUpdateLiveShoppingSpecialPriceMutationRes = boolean;

export const useAdminUpdateLiveShoppingSpecialPriceMutation = (): UseMutationResult<
  useAdminUpdateLiveShoppingSpecialPriceMutationRes,
  AxiosError,
  useAdminUpdateLiveShoppingSpecialPriceMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminUpdateLiveShoppingSpecialPriceMutationRes,
    AxiosError,
    useAdminUpdateLiveShoppingSpecialPriceMutationDto
  >(
    (dto: useAdminUpdateLiveShoppingSpecialPriceMutationDto) =>
      axios
        .patch<useAdminUpdateLiveShoppingSpecialPriceMutationRes>(
          `/admin/live-shopping/special-price/${dto.id}`,
          dto.dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('AdminLiveShoppingList');
      },
    },
  );
};
