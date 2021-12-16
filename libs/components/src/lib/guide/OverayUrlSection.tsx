import { Stack, Center, Divider, VStack, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { useEffect } from 'react';
import { UrlCard } from './OverlayUrlCard';

export function OverayUrlSection({
  completeStep,
}: {
  completeStep: () => void;
}): JSX.Element {
  const profile = useProfile();

  useEffect(() => {
    completeStep();
  }, [completeStep]);

  return (
    <Stack pt={3} pb={3} spacing={10}>
      <Center>
        <VStack spacing={0}>
          <Divider mb={3} borderWidth={0.5} />
          <Text>아래 URL을 복사하여, 기존 사용하고 있는 송출 프로그램에 추가합니다.</Text>
          <Text>이 때 너비는 1920, 높이는 1080으로 세팅하세요.</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={7} w={['6xl', 'xl']}>
          {!profile.isLoading && profile.data && <UrlCard profileData={profile.data} />}
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text>세팅이 완료되면 좌측 최하단에 파란색 점이 나타납니다.</Text>
          <Text>이는 배너 송출이 정상적으로 되고 있다는 신호입니다.</Text>
          <Text>라이브 커머스 종료 시점까지 배너는 끄지 않습니다.</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text fontWeight="semibold">이 때 다음 사항을 지켜주세요!</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text fontWeight="semibold">
            기존 내 도네이션과 라이브 커머스 배너가 겹치지 않도록 사전 세팅해주세요.
          </Text>
          <Text fontWeight="semibold">
            도네이션 볼륨을 적정하게 조정하고, 배너가 멈출 시 새로고침을 눌러 방송을
            재개합니다.
          </Text>
          <Text colorScheme="gray" fontWeight="thin">
            오버레이 URL 등록을 완료하였다면 아래의 다음 버튼을 클릭하여 다음단계를
            진행해주세요.
          </Text>
        </VStack>
      </Center>
    </Stack>
  );
}
