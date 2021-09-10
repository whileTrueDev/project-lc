import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

export const useSocialLoginFailAlarm = ({
  error,
  message,
  provider,
}: {
  error: string | string[];
  message: string | string[];
  provider: string | string[];
}) => {
  const toast = useToast();
  useEffect(() => {
    if (error === 'true') {
      if (message === 'email-required') {
        const names = { kakao: '카카오', naver: '네이버', google: '구글로' };
        if (typeof provider === 'string' && Object.keys(names).includes(provider)) {
          toast({
            description: `${
              names[provider as 'kakao' | 'naver' | 'google']
            } 로그인시, 이메일 동의가 필요합니다. 다시 시도해주세요.`,
            status: 'error',
            duration: 10000, // 중요한 정보니 기본 5초의 2배인 10초.
          });
        }
      }
    }
  }, [error, message, provider, toast]);
};
