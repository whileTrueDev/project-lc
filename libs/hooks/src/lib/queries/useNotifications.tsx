import { UserNotification } from '@prisma/client';
import { UserType } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type Notifications = UserNotification[];

export const getNotifications = async (
  userEmail?: string,
  userType?: UserType,
): Promise<Notifications> => {
  return axios
    .get<Notifications>('/notification', {
      params: {
        userEmail,
        userType: userType || process.env.NEXT_PUBLIC_APP_TYPE,
      },
    })
    .then((res) => res.data);
};

export const useNotifications = (
  userEmail?: string,
  userType?: UserType,
): UseQueryResult<Notifications, AxiosError> => {
  return useQuery<Notifications, AxiosError>(
    ['Notifications', userEmail],
    () => getNotifications(userEmail, userType),
    { enabled: !!userEmail },
  );
};
