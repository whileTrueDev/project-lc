import { Text } from '@chakra-ui/react';
import { BroadcasterDTOWithoutUserId } from '@project-lc/shared-types';

export function BroadcasterName(props: {
  data: BroadcasterDTOWithoutUserId;
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
