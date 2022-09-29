import {
  useState,
  useRef,
  useCallback,
  useEffect,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from 'react';

export interface UseCountdownResult {
  startCountdown: (startSecond: number) => void;
  clearTimer: () => void;
  seconds: number;
  setSeconds: Dispatch<SetStateAction<number>>;
  intervalRef: MutableRefObject<NodeJS.Timeout | null>;
  intervalCallbackRef: MutableRefObject<() => void>;
}

/**
 * 카운트다운 위한 훅
 * startCountdown(seconds) 와 같이 사용
 * 
 const { clearTimer, startCountdown, seconds } = useCountdown();

 return (
  <div>
    { seconds > 0 
      ? (<button onClick={() => startCountdown(10)}>10초 카운트다운 시작</button>)
      : (<div>{seconds}</div>)
    }
  </div>
 );
 */
export function useCountdown(): UseCountdownResult {
  const [seconds, setSeconds] = useState<number>(0);
  const intervalCallbackRef = useRef(() => setSeconds((second) => second - 1));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (seconds < 0) {
      clearTimer();
      setSeconds(0);
    }
  }, [clearTimer, seconds]);

  const startCountdown = useCallback(
    (startSecond: number) => {
      clearTimer();
      setSeconds(startSecond);
      intervalRef.current = setInterval(intervalCallbackRef.current, 1000);
    },
    [clearTimer],
  );

  return {
    startCountdown,
    clearTimer,
    seconds,
    setSeconds,
    intervalRef,
    intervalCallbackRef,
  };
}
