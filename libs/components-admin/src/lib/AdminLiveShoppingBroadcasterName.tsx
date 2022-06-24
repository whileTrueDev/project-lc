import { Text } from '@chakra-ui/react';
import { Broadcaster } from '@prisma/client';

export function AdminLiveShoppingBroadcasterName(props: {
  data: { userNickname: Broadcaster['userNickname']; email: Broadcaster['email'] };
  color?: string;
}): JSX.Element {
  const { data, color } = props;

  return (
    <>
      {data ? (
        <Text color={color || 'unset'}>
          {data ? `${data.userNickname} (${data.email})` : '미정'}
        </Text>
      ) : (
        <Text>미정</Text>
      )}
    </>
  );
}
export default AdminLiveShoppingBroadcasterName;
