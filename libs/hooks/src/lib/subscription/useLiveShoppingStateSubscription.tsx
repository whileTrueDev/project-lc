import {
  AdminMessage,
  LiveShoppingStateClientToServerEvents,
  LiveShoppingStateServerToClientEvents,
} from '@project-lc/shared-types';
import { getRealtimeApiHost } from '@project-lc/utils';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';
import axiosInstance from '../../axios';

export function useAlarmAudio(): {
  audio: HTMLAudioElement | null;
  playAudio: () => void;
} {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // node환경에서는 audio 객체 없어서 오류남. 브라우저 환경에 마운트 된 후 audio 생성하도록 하였음
  useEffect(() => {
    setAudio(new Audio('/audio/fever.mp3'));
  }, []);

  const playAudio = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio]);
  return { audio, playAudio };
}

type UseLiveShoppingStateSubscriptionReturn = {
  message: string;
  alert: boolean;
  setAlert: Dispatch<SetStateAction<boolean>>;
};

/** 방송인 현황판 실시간 메시지, 알림 위한 소켓연결
 * @return message:string 방송인 현황판으로 보내진 관리자 메시지
 * @return alert:boolean 알림 발생한 경우 true
 * @return setAlert 알림 애니메이션 종료 후 알림 off 하기위한 함수
 */
export const useLiveShoppingStateSubscription = (
  liveShoppingId: number,
): UseLiveShoppingStateSubscriptionReturn => {
  const [message, setMessage] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const client =
    useRef<
      Socket<LiveShoppingStateServerToClientEvents, LiveShoppingStateClientToServerEvents>
    >();

  const { playAudio } = useAlarmAudio();

  // * 알림 발생한경우 소리냄
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
  }, [client, liveShoppingId, queryClient]);

  return { message, alert, setAlert };
};

export default useLiveShoppingStateSubscription;
