import { Box, Heading, Text, Avatar, Flex } from '@chakra-ui/react';
import { useBroadcasterGiftDisplay } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function GiftBox(): JSX.Element {
  const router = useRouter();
  const broadcasterId = router.query.broadcaster;

  const { data } = useBroadcasterGiftDisplay(Number(broadcasterId));

  return (
    <Box>
      <Heading>선물정보</Heading>
      <Box mb={3}>
        <Text>방송인에게 선물하기를 하시면</Text>
        <Text>배송지를 입력하지 않아도 방송인에게 배송이 됩니다.</Text>
      </Box>
      <Flex alignItems="center">
        <Avatar src={data?.avatar} mr={2} />
        <Text fontWeight="bold">{data?.userNickname}</Text>
      </Flex>
    </Box>
  );
}
