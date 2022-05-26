import { useQuery, UseQueryResult } from 'react-query';
import { Customer } from '@prisma/client';
import { AxiosError } from 'axios';
import { CustomerIncludeDto } from '@project-lc/shared-types';

import axios from '../../axios';

export const getAdminCustomer = async (
  orderBy: string,
  orderByColumn?: string,
  include?: CustomerIncludeDto,
): Promise<Customer[]> => {
  return axios
    .get<Customer[]>('/admin/customer', {
      params: {
        orderBy,
        orderByColumn,
        include,
      },
    })
    .then((res) => res.data);
};

export const useAdminCustomer = (
  orderBy: string,
  orderByColumn?: string,
  include?: CustomerIncludeDto,
): UseQueryResult<Customer[], AxiosError> => {
  return useQuery<Customer[], AxiosError>(['getAdminCustomer'], () =>
    getAdminCustomer(orderBy, orderByColumn, include),
  );
};
