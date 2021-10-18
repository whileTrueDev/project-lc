import React from 'react';
import { Text } from '@chakra-ui/react';
import { BroadcasterDTO } from '@project-lc/shared-types';
import { ChakraNextImage } from './ChakraNextImage';
import twitchLogo from '../../images/twitchLogo.png';
import youtubeLogo from '../../images/youtubeLogo.png';
import afreecaLogo from '../../images/afreecaLogo.png';

function switchIcon(data: BroadcasterDTO): JSX.Element[] {
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

export function BroadcasterName(props: { data: BroadcasterDTO }): JSX.Element {
  const { data } = props;
  return (
    <>
      <Text>{data ? data.userNickname : '미정'}</Text>
      {data
        ? switchIcon(data).map((component, index) => (
            <>
              <React.Fragment key={index}>{component}</React.Fragment>
            </>
          ))
        : null}
    </>
  );
}
export default BroadcasterName;
