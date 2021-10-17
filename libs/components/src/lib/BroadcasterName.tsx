import React from 'react';
import { ChakraNextImage } from '@project-lc/components';
import { Box, Text } from '@chakra-ui/react';
import twitchLogo from '../../images/twitchLogo.png';
import youtubeLogo from '../../images/youtubeLogo.png';
import afreecaLogo from '../../images/afreecaLogo.png';

export interface BroadcasterPlatform {
  youtubeId?: string;
  twitchId?: string;
  afreecaId?: string;
  userNickname: string;
}

function switchIcon(data: BroadcasterPlatform): JSX.Element[] {
  const components = [];
  if (data.youtubeId) {
    components.push(<ChakraNextImage src={youtubeLogo} width="24" height="24" />);
  }
  if (data.twitchId) {
    components.push(<ChakraNextImage src={twitchLogo} width="24" height="24" />);
  }
  if (data.afreecaId) {
    components.push(<ChakraNextImage src={afreecaLogo} width="24" height="24" />);
  }
  return components;
}

export function BroadcasterName(props: { data: BroadcasterPlatform }): JSX.Element {
  const { data } = props;
  return (
    <>
      <Text fontWeight="bold">{data.userNickname}</Text>
      {switchIcon(data).map((component, index) => (
        <>
          <React.Fragment key={index}>{component}</React.Fragment>
        </>
      ))}
    </>
  );
}
export default BroadcasterName;
