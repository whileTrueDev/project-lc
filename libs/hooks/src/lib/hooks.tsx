import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useLogoutMutation } from './mutation/useLogoutMutation';
import { useProfile } from './queries/useProfile';

export function useSeconds() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setValue(value + 1);
    }, 1000);
  }, [value]);

  return { value, setValue };
}

export default useSeconds;

/**
 * 로그아웃 함수
 * - 프론트에서 글로벌에 저장하고 있는 유저정보 삭제
 * - 로그아웃요청(토큰삭제)
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useLogoutMutation();

  const logout = useCallback(() => {
    mutateAsync()
      .then((res) => {
        if (res === 'OK') {
          queryClient.clear();
          queryClient.removeQueries('Profile', { exact: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [mutateAsync, queryClient]);

  return { logout };
}

/**
 * 로그인 여부 리턴
 */
export function useIsLoggedIn() {
  const { data: profileData, status } = useProfile();
  const isLoggedIn = status === 'success' && !!profileData;

  return { isLoggedIn, status };
}

/**
 * 로그인 되어 있는 경우 메인으로 이동시키는 effect
 */
export function useMoveToMainIfLoggedIn() {
  const router = useRouter();
  const { isLoggedIn } = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);
}
