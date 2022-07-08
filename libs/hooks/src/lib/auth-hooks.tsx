import { UserType } from '@project-lc/shared-types';
import { liveShoppingStateBoardWindowStore } from '@project-lc/stores';
import { removeCartKey } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
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
  const { closeWindow } = liveShoppingStateBoardWindowStore();

  const logout = useCallback(() => {
    mutateAsync()
      .then((res) => {
        if (res === 'OK') {
          closeWindow();
          queryClient.clear();
          queryClient.removeQueries('Profile', { exact: true });
          removeCartKey();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [closeWindow, mutateAsync, queryClient]);

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
