import { Center, Divider, Stack, Text, VStack } from '@chakra-ui/react';
import { useBroadcaster, useBroadcasterContacts, useProfile } from '@project-lc/hooks';
import { guideConditionStore } from '@project-lc/stores';
import { useEffect, useMemo } from 'react';
import { BroadcasterAddressSection } from './BroadcasterAddress';
import { BroadcasterContactSection } from './BroadcasterContact';

export function AddressSection(): JSX.Element {
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);
  const broadcaster = useBroadcaster({ id: profile.data?.id });
  const { completeStep } = guideConditionStore();

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
          <Text>크크쇼 라이브 커머스를 시작하기 위해서는 연락처 등록이 필요합니다.</Text>
          <Text>
            아래 입력창을 통해 연락처와 샘플 및 선물을 수령받을 주소를 추가하세요.
          </Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={7} w={['6xl', 'xl']}>
          <BroadcasterContactSection />
          <Divider />
          <BroadcasterAddressSection />
          {연락처존재여부 && 주소존재여부 && (
            <Text color="GrayText">
              아래의 다음 버튼을 클릭하여 다음단계를 진행해주세요.
            </Text>
          )}
        </VStack>
      </Center>
    </Stack>
  );
}
