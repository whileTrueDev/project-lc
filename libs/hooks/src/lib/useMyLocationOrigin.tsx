import { useEffect, useState } from 'react';

/**
 * 현재 실행중 서버의 origin 명을 가져옵니다. ex) https://example.com -> example.com
 * @returns 현재 실행중 서버의 origin 명 문자열
 */
export const useMyLocationOrigin = (): string => {
  const [myLocationOrigin, setMyLocationHost] = useState('');
  useEffect(() => {
    if (typeof window !== undefined) {
      setMyLocationHost(window.location.hostname);
    }
  }, []);

  return myLocationOrigin;
};

export default useMyLocationOrigin;
