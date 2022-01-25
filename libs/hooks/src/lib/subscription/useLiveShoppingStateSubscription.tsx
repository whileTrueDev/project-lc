import {
  AdminMessage,
  LiveShoppingStateClientToServerEvents,
  LiveShoppingStateServerToClientEvents,
} from '@project-lc/shared-types';
import { getRealtimeApiHost } from '@project-lc/utils';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../axios';
import { useAlarmAudio } from '../useLiveShoppingStateBoardAlertState';

type UseLiveShoppingStateSubscriptionReturn = {
  message: string;
  alert: boolean;
  setAlert: Dispatch<SetStateAction<boolean>>;
};

export const useLiveShoppingStateSubscription = (
  liveShoppingId: number,
  onCreated?: (liveShoppingId: number) => void,
): UseLiveShoppingStateSubscriptionReturn => {
  const [message, setMessage] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const client =
    useRef<
      Socket<LiveShoppingStateServerToClientEvents, LiveShoppingStateClientToServerEvents>
    >();

  const { playAudio } = useAlarmAudio();
  useEffect(() => {
    if (alert) playAudio();
  }, [alert, playAudio]);

  useEffect(() => {
    client.current = io(`${getRealtimeApiHost()}/live-shopping-state`, {
      withCredentials: true,
      auth: {
        authorization: axiosInstance.defaults.headers.common.Authorization,
      },
    });
    const _client = client.current;

    _client.emit('subscribe', liveShoppingId);

    _client.on('adminMessageCreated', (data: AdminMessage) => {
      setMessage(data.text);
    });

    _client.on('adminAlertCreated', () => {
      setAlert(true);
    });

    _client.on('purchaseMessageUpdated', () => {
      queryClient.invalidateQueries('PurchaseMessages');
    });

    return () => {
      _client.off('subscribed');
      _client.off('adminMessageCreated');
      _client.off('adminAlertCreated');
      _client.off('purchaseMessageUpdated');
      _client.close();
    };
  }, [client, liveShoppingId, onCreated, queryClient]);

  return { message, alert, setAlert };
};

export default useLiveShoppingStateSubscription;
