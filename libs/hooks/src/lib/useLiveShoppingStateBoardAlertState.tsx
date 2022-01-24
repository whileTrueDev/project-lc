import { useBoolean } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { useLiveShoppingStateBoardAdminAlert } from '..';

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

/**
 * 관리자 알림 관련 훅, 이펙트
 */
export function useLiveShoppingStateBoardAlertState({
  liveShoppingId,
  refetchInterval,
}: {
  liveShoppingId: number;
  refetchInterval?: number;
}): {
  hasAlert: boolean;
  setAlertFalse: () => void;
} {
  // * 관리자 알림
  const { data: alertData } = useLiveShoppingStateBoardAdminAlert({
    liveShoppingId,
    refetchInterval,
  });

  // 관리자 알림 있음 여부 저장 -> 실시간 현황창 애니메이션 위한 변수
  const [hasAlert, { on, off }] = useBoolean();
  const { playAudio } = useAlarmAudio();

  const onAlertHandler = useCallback(() => {
    on();
    playAudio();
  }, [on, playAudio]);

  // 관리자 알림 있는경우 애니메이션 & 알림음 발생 이펙트
  useEffect(() => {
    if (alertData) {
      onAlertHandler();
    }
  }, [alertData, onAlertHandler]);

  return {
    hasAlert,
    setAlertFalse: off,
  };
}
