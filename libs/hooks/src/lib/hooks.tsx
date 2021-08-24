import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { useLogoutMutation } from './mutation/useLogoutMutation';

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
    queryClient.removeQueries('Profile', { exact: true });
    mutateAsync();
  }, [mutateAsync, queryClient]);

  return { logout };
}
