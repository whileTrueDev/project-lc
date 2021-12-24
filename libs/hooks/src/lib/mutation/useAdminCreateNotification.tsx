import { UserNotification } from '@prisma/client';
import {
  CreateMultipleNotificationDto,
  CreateNotificationDto,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../axios';

export type useAdminCreateNotificationDto = CreateNotificationDto;
export type useAdminCreateNotificationRes = UserNotification;

export const useAdminCreateNotification = (): UseMutationResult<
  useAdminCreateNotificationRes,
  AxiosError,
  useAdminCreateNotificationDto
> => {
  return useMutation<
    useAdminCreateNotificationRes,
    AxiosError,
    useAdminCreateNotificationDto
  >((dto: useAdminCreateNotificationDto) =>
    axios
      .post<useAdminCreateNotificationRes>('/notification/admin', dto)
      .then((res) => res.data),
  );
};

export type useAdminCreateMultipleNotificationDto = CreateMultipleNotificationDto;
export type useAdminCreateMultipleNotificationRes = boolean;

export const useAdminCreateMultipleNotification = (): UseMutationResult<
  useAdminCreateNotificationRes,
  AxiosError,
  useAdminCreateMultipleNotificationDto
> => {
  return useMutation<
    useAdminCreateNotificationRes,
    AxiosError,
    useAdminCreateMultipleNotificationDto
  >((dto: useAdminCreateMultipleNotificationDto) =>
    axios
      .post<useAdminCreateNotificationRes>('/notification/admin/multiple', dto)
      .then((res) => res.data),
  );
};
