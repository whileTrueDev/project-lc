import { Customer, CustomerAddress } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQueryClient, useMutation, UseMutationResult } from 'react-query';
import { CustomerAddressDto, CustomerAddressUpdateDto } from '@project-lc/shared-types';
import axios from '../../axios';

export type useCustomerAddressDto = CustomerAddressDto & { customerId: Customer['id'] };
export type useCustomerAddressRes = CustomerAddress;
/** 소비자 주소록 등록 */
export const useCustomerAddressMutation = (): UseMutationResult<
  useCustomerAddressRes,
  AxiosError,
  useCustomerAddressDto
> => {
  const queryClient = useQueryClient();
  return useMutation<useCustomerAddressRes, AxiosError, useCustomerAddressDto>(
    (dto: useCustomerAddressDto) =>
      axios
        .post<useCustomerAddressRes>(`/customer/${dto.customerId}/address`, dto)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
        queryClient.invalidateQueries('DefaultCustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
      },
    },
  );
};

export type useCustomerAddressDeleteDto = {
  customerId: Customer['id'];
  addressId: CustomerAddress['id'];
};
export type useCustomerAddressDeleteRes = boolean;
/** 소비자 주소록 삭제 */
export const useCustomerAddressDeleteMutation = (): UseMutationResult<
  useCustomerAddressDeleteRes,
  AxiosError,
  useCustomerAddressDeleteDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCustomerAddressDeleteRes,
    AxiosError,
    useCustomerAddressDeleteDto
  >(
    (dto: useCustomerAddressDeleteDto) =>
      axios
        .delete<useCustomerAddressDeleteRes>(
          `/customer/${dto.customerId}/address/${dto.addressId}`,
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
        queryClient.invalidateQueries('DefaultCustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
      },
    },
  );
};

export type useCustomerAddressUpdateDto = CustomerAddressUpdateDto & {
  customerId: Customer['id'];
  addressId: CustomerAddress['id'];
};
export type useCustomerAddressUpdateRes = CustomerAddress;
/** 소비자 주소록 수정 */
export const useCustomerAddressUpdateMutation = (): UseMutationResult<
  useCustomerAddressUpdateRes,
  AxiosError,
  useCustomerAddressUpdateDto
> => {
  const queryClient = useQueryClient();
  return useMutation<
    useCustomerAddressUpdateRes,
    AxiosError,
    useCustomerAddressUpdateDto
  >(
    (dto: useCustomerAddressUpdateDto) =>
      axios
        .patch<useCustomerAddressUpdateRes>(
          `/customer/${dto.customerId}/address/${dto.addressId}`,
          { ...dto, customerId: undefined, addressId: undefined },
        )
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('CustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
        queryClient.invalidateQueries('DefaultCustomerAddress', {
          refetchActive: true,
          refetchInactive: true,
        });
      },
    },
  );
};
