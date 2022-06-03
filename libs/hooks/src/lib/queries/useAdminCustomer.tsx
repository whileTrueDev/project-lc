import { Customer } from '@prisma/client';
import { FindCustomerDto } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminCustomer = async (dto: FindCustomerDto): Promise<Customer[]> => {
  return axios
    .get<Customer[]>('/admin/customer', { params: dto })
    .then((res) => res.data);
};

export const useAdminCustomer = (
  dto: FindCustomerDto,
): UseQueryResult<Customer[], AxiosError> => {
  return useQuery<Customer[], AxiosError>(['AdminCustomer'], () => getAdminCustomer(dto));
};
