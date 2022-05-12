import { Avatar, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useBroadcaster } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function GiftBox(): JSX.Element {
  const router = useRouter();
  const broadcasterId = router.query.broadcaster;

  const { data } = useBroadcaster({ id: Number(broadcasterId) });

  return (
    <SectionWithTitle title="선물 방송인">
      <Flex alignItems="center">
        <Avatar src={data?.avatar || ''} mr={2} />
        <Text fontWeight="bold">{data?.userNickname}</Text>
      </Flex>

      <UnorderedList fontSize="xs" mt={3}>
        <ListItem>
          <Text>
            선물시, 배송지를 입력하지 않아도 주문상품이 방송인에게 올바르게 배송 됩니다.
          </Text>
        </ListItem>
        <ListItem>
          <Text>선물 주문을 취소할 수 있습니다.?</Text>
        </ListItem>
        <ListItem>
          <Text>선물 주문은 주문 완료 이후 취소할 수 없습니다.?</Text>
        </ListItem>
      </UnorderedList>
    </SectionWithTitle>
  );
}
