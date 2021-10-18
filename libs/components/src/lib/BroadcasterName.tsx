import React from 'react';
import { Text } from '@chakra-ui/react';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { ChakraNextImage } from './ChakraNextImage';
import twitchLogo from '../../images/twitchLogo.png';
import youtubeLogo from '../../images/youtubeLogo.png';
import afreecaLogo from '../../images/afreecaLogo.png';

export function BroadcasterName(props: { data: BroadcasterDTO }): JSX.Element {
  const { data } = props;

  return (
    <>
      <Text>{data ? data.userNickname : '미정'}</Text>
      {data.youtubeId ? (
        <ChakraNextImage src={youtubeLogo} width="24" height="24" />
      ) : null}
      {data.twitchId ? <ChakraNextImage src={twitchLogo} width="24" height="24" /> : null}
      {data.afreecaId ? (
        <ChakraNextImage src={afreecaLogo} width="24" height="24" />
      ) : null}
    </>
  );
}
export default BroadcasterName;
