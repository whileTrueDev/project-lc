import { Text } from '@chakra-ui/react';
import { BroadcasterDTOWithoutUserId } from '@project-lc/shared-types';

export function BroadcasterName(props: {
  data: BroadcasterDTOWithoutUserId;
}): JSX.Element {
  const { data } = props;

  return (
    <>{data ? <Text>{data ? data.userNickname : '미정'}</Text> : <Text>미정</Text>}</>
  );
}
export default BroadcasterName;
