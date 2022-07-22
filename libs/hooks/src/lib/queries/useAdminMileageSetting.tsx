import { MileageSetting } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export const getAdminMileageSetting = async (): Promise<MileageSetting> => {
  return axios.get<MileageSetting>('/mileage-setting').then((res) => res.data);
};

/** 관리자 기본 마일리지 세팅 조회 훅 */
export const useAdminMileageSetting = (): UseQueryResult<MileageSetting, AxiosError> => {
  return useQuery<MileageSetting, AxiosError>(
    'AdminMileageSetting',
    getAdminMileageSetting,
  );
};
