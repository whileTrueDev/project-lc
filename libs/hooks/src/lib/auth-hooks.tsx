import { UserType } from '@project-lc/shared-types';
import { liveShoppingStateBoardWindowStore } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { useLogoutMutation } from './mutation/useLogoutMutation';
import { useProfile } from './queries/useProfile';

/**
 * 로그아웃 함수
 * - 프론트에서 글로벌에 저장하고 있는 유저정보 삭제
 * - 로그아웃요청(토큰삭제)
 * - 방송인 현황판 윈도우 종료
 */
export function useLogout(): { logout: () => void } {
  const queryClient = useQueryClient();
  const { mutateAsync } = useLogoutMutation();
  const { closeWindows } = liveShoppingStateBoardWindowStore();

  const logout = useCallback(() => {
    mutateAsync()
      .then((res) => {
        if (res === 'OK') {
          closeWindows();
          queryClient.clear();
          queryClient.removeQueries('Profile', { exact: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [closeWindows, mutateAsync, queryClient]);

  return { logout };
}

/**
 * 로그인 여부 리턴
 */
export function useIsLoggedIn(): {
  isLoggedIn: boolean;
  status: 'idle' | 'error' | 'loading' | 'success';
  type: UserType | undefined;
} {
  const { data: profileData, status } = useProfile();
  const isLoggedIn = status === 'success' && !!profileData;

  return { isLoggedIn, status, type: profileData?.type };
}

/**
 * 로그인 되어 있는 경우 메인으로 이동시키는 effect
 */
export function useMoveToMainIfLoggedIn(): void {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);
}

/**
 * 로그인 상태가 아닌 경우 방송인센터 라이브 방송 현황판 윈도우 닫기 이펙트
 BroadcastChannel : 동일 origin 에 있는 window, tab, iframe 사이에서 통신 할 수 있게 하는 api
 방송인센터 탭 여러개 켜놓고 한곳에서 로그아웃 한 경우 
 다른 탭에서 열린 현황판 window 종료하기 위해 사용
 */
export function useCloseLiveShoppingStateBoardIfNotLoggedIn(): void {
  const bcRef = useRef<BroadcastChannel | null>();
  const { isLoggedIn, status } = useIsLoggedIn();
  const { closeWindows } = liveShoppingStateBoardWindowStore();

  // 마운트시 bc 객체 생성 & ev 메시지 핸들러 할당
  useEffect(() => {
    bcRef.current = new BroadcastChannel('LoginFlag');
    bcRef.current.onmessage = (ev) => {
      if (ev.data === 'not logged in') {
        closeWindows();
      }
    };
    return () => {
      if (bcRef.current) {
        bcRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 상태가 아닌경우 'not logged in' 메시지 발송
  useEffect(() => {
    if (!isLoggedIn || status === 'error') {
      bcRef.current?.postMessage('not logged in');
    }
  }, [isLoggedIn, status]);
}
