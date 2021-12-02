import React from 'react';
import { Text } from '@chakra-ui/react';
import { BroadcasterDTOWithoutUserId } from '@project-lc/shared-types';
// import { ChakraNextImage } from './ChakraNextImage';
// import twitchLogo from '../../images/twitchLogo.png';
// import youtubeLogo from '../../images/youtubeLogo.png';
// import afreecaLogo from '../../images/afreecaLogo.png';

export function BroadcasterName(props: {
  data: BroadcasterDTOWithoutUserId;
}): JSX.Element {
  const { data } = props;

  return (
    <>{data ? <Text>{data ? data.userNickname : '미정'}</Text> : <Text>미정</Text>}</>
  );
}
export default BroadcasterName;
