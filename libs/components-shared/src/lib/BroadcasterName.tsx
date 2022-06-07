import { Text } from '@chakra-ui/react';
import { Broadcaster } from '@prisma/client';

export function BroadcasterName(props: {
  data: { userNickname: Broadcaster['userNickname'] };
  color?: string;
}): JSX.Element {
  const { data, color } = props;

  return (
    <>
      {data ? (
        <Text color={color || 'unset'}>{data ? data.userNickname : '미정'}</Text>
      ) : (
        <Text>미정</Text>
      )}
    </>
  );
}
export default BroadcasterName;
