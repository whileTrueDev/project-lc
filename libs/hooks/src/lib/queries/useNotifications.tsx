import { UserNotification } from '@prisma/client';
import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type Notifications = UserNotification[];

const TAKE = 6; // 최근 알림 몇개를 가지고 올것인지
type ListType = 'part' | 'all'; // part: 최근 알림 TAKE개 조회, all : 최근 30일간 모든 알림조회

export const getNotifications = async (
  listType: ListType,
  userEmail?: string,
  userType?: UserType,
): Promise<Notifications> => {
  return axios
    .get<Notifications>('/notification', {
      params: {
        userEmail,
        userType: userType || process.env.NEXT_PUBLIC_APP_TYPE,
        take: listType === 'part' ? TAKE : undefined,
      },
    })
    .then((res) => res.data);
};

/** 최근 30일 내 일부(날짜 내림차순 take개) 알림목록 조회 */
export const useRecentNotifications = (
  userEmail?: string,
  userType?: UserType,
): UseQueryResult<Notifications, AxiosError> => {
  return useQuery<Notifications, AxiosError>(
    ['Notifications', 'part', userEmail],
    () => getNotifications('part', userEmail, userType),
    { enabled: !!userEmail },
  );
};

/** 최근 30일 내 전체 알림목록 조회 */
export const useNotifications = (
  userEmail?: string,
  userType?: UserType,
): UseQueryResult<Notifications, AxiosError> => {
  return useQuery<Notifications, AxiosError>(
    ['Notifications', 'all', userEmail],
    () => getNotifications('all', userEmail, userType),
    { enabled: !!userEmail },
  );
};
