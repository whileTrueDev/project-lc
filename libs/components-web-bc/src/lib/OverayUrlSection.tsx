import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Flex,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { guideConditionStore } from '@project-lc/stores';
import { useEffect } from 'react';
import { OverlayUrlCard } from './OverlayUrlCard';

export function OverayUrlSection(): JSX.Element {
  const { completeStep } = guideConditionStore();

  useEffect(() => {
    completeStep();
  }, [completeStep]);

  return (
    <Stack pt={3} pb={3} spacing={2}>
      <Center>
        <VStack spacing={0}>
          <Text>아래 URL을 복사하여, 기존 사용하고 있는 송출 프로그램에 추가합니다.</Text>
          <Text>
            이 때 너비는{' '}
            <Text as="span" color="green.500" fontSize="lg" fontWeight="bold">
              1920
            </Text>
            , 높이는{' '}
            <Text as="span" color="green.500" fontSize="lg" fontWeight="bold">
              1080
            </Text>
            으로 세팅하세요.
          </Text>
        </VStack>
      </Center>

      <Center>
        <Box w={['6xl', 'xl']}>
          <OverlayUrlCard />
        </Box>
      </Center>

      <VStack spacing={0} whiteSpace="break-spaces" textAlign="center">
        <Text>{`세팅이 완료되면 좌측 최하단에 파란색 점이 나타납니다.\n이는 배너 송출이 정상적으로 되고 있다는 신호입니다.\n라이브 커머스 종료 시점까지 배너는 끄지 않습니다.`}</Text>
      </VStack>
      <VStack spacing={0} />

      <Alert status="info">
        <Stack>
          <Flex align="center">
            <AlertIcon />
            <Text fontWeight="semibold">다음 사항을 꼭 지켜주세요!</Text>
          </Flex>
          <UnorderedList p={4}>
            <ListItem>
              기존 내 도네이션과 라이브 커머스 배너가 겹치지 않도록 사전 세팅해주세요.
            </ListItem>
            <ListItem>도네이션 볼륨을 적정하게 조정하세요.</ListItem>
            <ListItem>배너가 멈출 시 새로고침을 눌러 방송을 재개합니다.</ListItem>
          </UnorderedList>
        </Stack>
      </Alert>

      <Center textAlign="center">
        <Text color="GrayText" whiteSpace="break-spaces">
          {`오버레이 URL 등록을 완료하였다면\n아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.`}
        </Text>
      </Center>
    </Stack>
  );
}
