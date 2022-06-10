import { ProductPromotion } from '@prisma/client';
import { FindProductPromotionsDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getProductPromotions = async (
  dto: FindProductPromotionsDto,
): Promise<ProductPromotion[]> => {
  return axios
    .get<ProductPromotion[]>('/product-promotions', { params: dto })
    .then((res) => res.data);
};

export const useProductPromotions = (
  dto: FindProductPromotionsDto,
): UseQueryResult<ProductPromotion[], AxiosError> => {
  return useQuery<ProductPromotion[], AxiosError>(
    'ProductPromotions',
    () => getProductPromotions(dto),
    { enabled: !!dto },
  );
};
