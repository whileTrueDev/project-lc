import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';
import { Notifications } from './useNotifications';

/** 관리자에서 유저에게 보낸 개인알림 조회 - skip, take적용 안하고 30일 내 모든 알림 조회함 */
export const getAdminNotifications = async (
  userEmail?: string,
  userType?: UserType,
): Promise<Notifications> => {
  return axios
    .get<Notifications>('/notification', {
      params: {
        userEmail,
        userType,
      },
    })
    .then((res) => {
      return res.data;
    });
};

/** 관리자에서 특정 유저에게 보낸 최근 30일 내 전체 알림목록 조회 */
export const useAdminNotifications = (
  enabled: boolean,
  userEmail?: string,
  userType?: UserType,
): UseQueryResult<Notifications, AxiosError> => {
  return useQuery<Notifications, AxiosError>(
    ['AdminNotifications', userEmail],
    () => getAdminNotifications(userEmail, userType),
    { enabled },
  );
};
