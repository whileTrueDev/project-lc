import {
  CreateNotificationDto,
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from '@project-lc/shared-types';
import { getRealtimeApiHost } from '@project-lc/utils';
import { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../axios';

/**
 * 알림메시지 소켓 연결 & 이벤트핸들러 등록
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useNotificationSubscription = (
  onCreated?: (newNoti: CreateNotificationDto) => void,
) => {
  const queryClient = useQueryClient();
  const client =
    useRef<Socket<NotificationServerToClientEvents, NotificationClientToServerEvents>>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.current = io(`${getRealtimeApiHost()}/notification`, {
      withCredentials: true,
      auth: {
        authorization: axiosInstance.defaults.headers.common.Authorization,
      },
    });
    const _client = client.current;

    _client.emit('subscribe');

    _client.on('created', (notification) => {
      const queryKey = ['Notifications'];
      queryClient.invalidateQueries(queryKey);
      if (onCreated) onCreated(notification);
    });

    return () => {
      _client.off('subscribed');
      _client.off('created');
      _client.close();
    };
  }, [client, onCreated, queryClient]);

  return client.current;
};

export default useNotificationSubscription;
