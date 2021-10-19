import { GoodsImages } from '@prisma/client';
import { GoodsImageDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export const useGoodsImageMutation = (): UseMutationResult<
  GoodsImages[],
  AxiosError,
  GoodsImageDto[]
> => {
  return useMutation<GoodsImages[], AxiosError, GoodsImageDto[]>((dto: GoodsImageDto[]) =>
    axios.post<GoodsImages[]>('/goods/image', dto).then((res) => res.data),
  );
};

export const useDeleteGoodsImageMutation = (): UseMutationResult<
  boolean,
  AxiosError,
  number
> => {
  return useMutation<boolean, AxiosError, number>((imageId: number) =>
    axios.delete<boolean>('/goods/image', { data: { imageId } }).then((res) => res.data),
  );
};
