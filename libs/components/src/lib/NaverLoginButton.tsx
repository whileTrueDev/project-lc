import { Button } from '@chakra-ui/react';
import { USER_TYPE_KEY } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import naverLogo from '../../images/naver.png';
import { ChakraNextImage } from './ChakraNextImage';
import { UserTypeProps } from './GoogleLoginButton';

const NAVER_COLOR = '#03c75a';
export function NaverLoginButton({ userType }: UserTypeProps): JSX.Element {
  return (
    <Button
      as="a"
      isFullWidth
      href={`${getApiHost()}/social/naver/login?${USER_TYPE_KEY}=${userType}`}
      bg={NAVER_COLOR}
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      leftIcon={<ChakraNextImage src={naverLogo} width="24" height="24" />}
      color="white"
    >
      네이버 로그인
    </Button>
  );
}

export default NaverLoginButton;
