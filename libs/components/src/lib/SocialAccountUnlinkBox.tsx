import { Button, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';
import {
  SocialAccount,
  useProfile,
  useUnlinkSocialAccountMutation,
} from '@project-lc/hooks';
import google from '../../docs/google.png';
import naver from '../../docs/naver.png';
import kakao from '../../docs/kakao.png';
import { ChakraNextImage } from './ChakraNextImage';
import SocialAccountUnlinkDialog from './SocialAccountUnlinkDialog';

export const logo: Record<string, React.ReactNode> = {
  google: <ChakraNextImage src={google} width="40" height="40" />,
  naver: <ChakraNextImage src={naver} width="40" height="40" />,
  kakao: <ChakraNextImage src={kakao} width="40" height="40" />,
};

export function SocialAccountUnlinkBox(props: SocialAccount) {
  const { provider, serviceId } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: unlinkSocialAccount } = useUnlinkSocialAccountMutation();
  const { data } = useProfile();
  const toast = useToast();

  const unlink = () => {
    unlinkSocialAccount({ provider, serviceId })
      .then((res) => {
        toast({ title: '연동해제 성공' });
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '연동해제 오류', status: 'error' });
      });
  };

  return (
    <Flex
      boxShadow="xs"
      p="4"
      rounded="md"
      width="100%"
      justify="space-around"
      align="center"
    >
      {logo[provider]}
      <Text>{provider}</Text>
      <Button onClick={onOpen}>연동해제</Button>
      <SocialAccountUnlinkDialog
        headerText={`${provider} 계정의 연결을 해제하시겠습니까?`}
        isOpen={!!data && isOpen}
        onClose={onClose}
        hasPassword={!!data?.hasPassword}
        unlinkHandler={unlink}
      />
    </Flex>
  );
}
