import { CheckIcon } from '@chakra-ui/icons';
import { Center, Divider, GridItem, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import { useBroadcaster, useBroadcasterContacts, useProfile } from '@project-lc/hooks';
import { useEffect, useMemo } from 'react';
import { BroadcasterAddressSection } from '../BroadcasterAddress';
import { BroadcasterContactSection } from '../BroadcasterContact';

export function AddressSection({
  completeStep,
}: {
  completeStep: () => void;
}): JSX.Element {
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);
  const broadcaster = useBroadcaster({ id: profile.data?.id });

  const 연락처존재여부 = useMemo<boolean>(
    () => !broadcasterContacts.isLoading && broadcasterContacts.data?.length !== 0,
    [broadcasterContacts],
  );

  const 주소존재여부 = useMemo<boolean>(
    () => !broadcaster.isLoading && !!broadcaster.data?.broadcasterAddress?.address,
    [broadcaster],
  );

  useEffect(() => {
    if (연락처존재여부 && 주소존재여부) {
      completeStep();
    }
  }, [연락처존재여부, 주소존재여부, completeStep]);

  return (
    <Stack pt={3} pb={3} spacing={10}>
      <Center>
        <VStack spacing={0}>
          <Divider mb={3} borderWidth={0.5} />
          <Text>크크쇼 라이브 커머스를 시작하기 위해서는 연락처 등록이 필요합니다.</Text>
          <Text>
            아래 입력창을 통해 연락처와 샘플 및 선물을 수령받을 주소를 추가하세요.
          </Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={7} w={['6xl', 'xl']}>
          {!연락처존재여부 ? (
            <BroadcasterContactSection />
          ) : (
            <VStack>
              <HStack spacing={6}>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold">
                    연락처 입력 상태
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <Text fontSize="lg" as="u">
                    연락처 입력 완료
                  </Text>
                  <CheckIcon color="green.500" ml={1} />
                </GridItem>
              </HStack>
            </VStack>
          )}
          <Divider />

          {!주소존재여부 ? (
            <BroadcasterAddressSection />
          ) : (
            <VStack>
              <HStack spacing={6}>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold">
                    주소 입력 상태
                  </Text>
                </GridItem>
                <GridItem display="flex" alignItems="center">
                  <Text fontSize="lg" as="u">
                    주소 입력 완료
                  </Text>
                  <CheckIcon color="green.500" ml={1} />
                </GridItem>
              </HStack>
            </VStack>
          )}
          {연락처존재여부 && 주소존재여부 && (
            <Text colorScheme="gray.500" fontWeight="thin">
              아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
            </Text>
          )}
        </VStack>
      </Center>
    </Stack>
  );
}
