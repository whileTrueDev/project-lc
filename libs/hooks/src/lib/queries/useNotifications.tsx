import { UserNotification } from '@prisma/client';
import { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '../../axios';

export type Notifications = UserNotification[];

export const getNotifications = async (userEmail?: string): Promise<Notifications> => {
  const userType = process.env.NEXT_PUBLIC_APP_TYPE;
  return axios
    .get<Notifications>('/notification', {
      params: {
        userEmail,
        userType,
      },
    })
    .then((res) => res.data);
};

export const useNotifications = (
  userEmail?: string,
): UseQueryResult<Notifications, AxiosError> => {
  return useQuery<Notifications, AxiosError>(
    ['Notifications', userEmail],
    () => getNotifications(userEmail),
    { enabled: !!userEmail },
  );
};
