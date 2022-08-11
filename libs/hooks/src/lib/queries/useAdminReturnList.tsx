import { AdminReturnListDto, AdminReturnRes } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type AdminReturnList = AdminReturnRes;

export const getAdminReturnList = async (
  dto: AdminReturnListDto,
): Promise<AdminReturnList> => {
  return axios
    .get<AdminReturnList>('/admin/returns', { params: dto })
    .then((res) => res.data);
};

export const useAdminReturnList = (
  dto: AdminReturnListDto,
): UseQueryResult<AdminReturnList, AxiosError> => {
  return useQuery<AdminReturnList, AxiosError>(
    ['AdminReturnList', dto],
    () => getAdminReturnList(dto),
    { enabled: !!dto },
  );
};
