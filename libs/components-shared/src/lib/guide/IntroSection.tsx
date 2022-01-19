import { Center, Divider, Stack, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { guideConditionStore } from '@project-lc/stores';

export function IntroSection(): JSX.Element {
  const { completeStep } = guideConditionStore();

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
        <VStack spacing={0}>
          <Text>라이브 쇼핑 진행에 필요한 정보를 등록하고</Text>
          <Text>크크쇼를 시작하세요!</Text>
        </VStack>
      </Center>
    </Stack>
  );
}
