import { Stack, Center, Link, VStack, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import NextLink from 'next/link';

export function SettlementsSection({
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
          <Text>라이브 쇼핑을 진행해서 수익을 창출했다면,</Text>
          <Text>당연히 수익을 현금화 할 수 있어야겠죠?</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text>크크쇼에서는 안전하게 수익금을 정산하기 위해</Text>
          <Text>방송인님에 대한 몇가지 정보를 요구합니다.</Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={0}>
          <Text>수익금 출금 신청을 하면 매달 정산처리 됩니다.</Text>
          <Text>출금을 하기 위해서는 정산등록이 필요합니다.</Text>
          <Text>
            출금 신청과 정산 등록은
            <NextLink href="/mypage/settlement" passHref>
              <Link ml={1} color="blue">
                [정산]
              </Link>
            </NextLink>
            에서 진행할 수 있습니다.
          </Text>
        </VStack>
      </Center>
      <Center>
        <VStack spacing={1}>
          <Text colorScheme="gray" fontWeight="thin">
            가이드의 모든 과정을 완수하셨습니다.
          </Text>
          <Text colorScheme="gray" fontWeight="thin">
            아래의 다음 버튼을 클릭하여 가이드를 완료해주세요.
          </Text>
        </VStack>
      </Center>
    </Stack>
  );
}
