import { Customer } from '@prisma/client';
import { OrderItemReviewNeededRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getOrderItemReviewNeeded = async (
  customerId?: Customer['id'],
): Promise<OrderItemReviewNeededRes> => {
  if (!customerId) return [];
  return axios
    .get<OrderItemReviewNeededRes>(`/order-item/review-needed`, {
      params: { customerId },
    })
    .then((res) => res.data);
};
export const ORDERITEM_REVIEW_NEEDED_QUERY_KEY = 'OrderItemReviewNeeded';
export const useOrderItemReviewNeeded = (
  customerId?: Customer['id'],
): UseQueryResult<OrderItemReviewNeededRes, AxiosError> => {
  return useQuery<OrderItemReviewNeededRes, AxiosError>(
    ORDERITEM_REVIEW_NEEDED_QUERY_KEY,
    () => getOrderItemReviewNeeded(customerId),
    {
      enabled: !!customerId,
    },
  );
};
