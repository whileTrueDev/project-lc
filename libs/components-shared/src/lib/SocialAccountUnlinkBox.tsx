import { Button, Flex, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useProfile, useUnlinkSocialAccountMutation } from '@project-lc/hooks';
import { SocialAccount, UserType } from '@project-lc/shared-types';
import google from '@project-lc/components-core/images/google.png';
import kakao from '@project-lc/components-core/images/kakao.png';
import naver from '@project-lc/components-core/images/naver.png';
import SocialAccountUnlinkDialog from './SocialAccountUnlinkDialog';

export const logo: Record<string, React.ReactNode> = {
  google: <ChakraNextImage src={google} width="40" height="40" />,
  naver: <ChakraNextImage src={naver} width="40" height="40" />,
  kakao: <ChakraNextImage src={kakao} width="40" height="40" />,
};

export function SocialAccountUnlinkBox(
  props: SocialAccount & { userType?: UserType },
): JSX.Element {
  const { provider, serviceId, userType = 'seller' } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: unlinkSocialAccount } = useUnlinkSocialAccountMutation();
  const { data } = useProfile();
  const toast = useToast();

  const unlink = (): void => {
    if (!data) return;
    unlinkSocialAccount({ provider, serviceId, userType })
      .then((res) => {
        toast({ title: '연동해제 성공', status: 'success' });
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast({ title: '연동해제 오류', status: 'error' });
      });
  };

  return (
    <Flex
      maxWidth="sm"
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
