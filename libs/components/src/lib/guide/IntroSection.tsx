import { Center, Divider, Stack, Text, VStack } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core';
import { useEffect } from 'react';
import naver from '../../../images/naver.png';

export function IntroSection({
  completeStep,
}: {
  completeStep: () => void;
}): JSX.Element {
  useEffect(() => {
    completeStep();
  }, [completeStep]);

  return (
    <Stack pt={10} pb={3} spacing={10}>
      <Center>
        <VStack spacing={0}>
          <Text fontSize="2xl" fontWeight="semibold">
            크크쇼 시작하기
          </Text>
          <Divider />
        </VStack>
      </Center>
      <Center>
        <ChakraNextImage src={naver} width="40" height="40" />
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text>라이브 쇼핑 진행에 필요한 정보를 등록하고</Text>
          <Text>크크쇼를 시작하세요!</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text>크크쇼를 시작하기 위해서</Text>
          <Text>연락처, 이용 동의, 플랫폼 추가</Text>
          <Text>등을 진행하셔야 합니다.</Text>
        </VStack>
      </Center>
    </Stack>
  );
}
