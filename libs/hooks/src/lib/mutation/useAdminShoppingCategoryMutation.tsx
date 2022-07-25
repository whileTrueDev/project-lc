import { KkshowShoppingTabCategory } from '@prisma/client';
import { KkshowShoppingTabCategoryDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';
import { kkshowShoppingCategoriesKey } from '../queries/useKkshowShopping';

export type useAdminShoppingCategoryAddMutationDto = KkshowShoppingTabCategoryDto;
export type useAdminShoppingCategoryAddMutationRes = KkshowShoppingTabCategory;

export const useAdminShoppingCategoryAddMutation = (): UseMutationResult<
  useAdminShoppingCategoryAddMutationRes,
  AxiosError,
  useAdminShoppingCategoryAddMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminShoppingCategoryAddMutationRes,
    AxiosError,
    useAdminShoppingCategoryAddMutationDto
  >(
    (dto: useAdminShoppingCategoryAddMutationDto) =>
      axios
        .post<useAdminShoppingCategoryAddMutationRes>(
          '/admin/kkshow-shopping/category',
          dto,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('GoodsCategory');
        queryClient.invalidateQueries('AdminCategory');
        queryClient.invalidateQueries(kkshowShoppingCategoriesKey);
      },
    },
  );
};

export type useAdminShoppingCategoryRemoveMutationDto = KkshowShoppingTabCategoryDto;
export type useAdminShoppingCategoryRemoveMutationRes = boolean;

export const useAdminShoppingCategoryRemoveMutation = (): UseMutationResult<
  useAdminShoppingCategoryRemoveMutationRes,
  AxiosError,
  useAdminShoppingCategoryRemoveMutationDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useAdminShoppingCategoryRemoveMutationRes,
    AxiosError,
    useAdminShoppingCategoryRemoveMutationDto
  >(
    (dto: useAdminShoppingCategoryRemoveMutationDto) =>
      axios
        .delete<useAdminShoppingCategoryRemoveMutationRes>(
          `/admin/kkshow-shopping/category/${dto.categoryCode}`,
        )
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('GoodsCategory');
        queryClient.invalidateQueries('AdminCategory');
        queryClient.invalidateQueries(kkshowShoppingCategoriesKey);
      },
    },
  );
};
